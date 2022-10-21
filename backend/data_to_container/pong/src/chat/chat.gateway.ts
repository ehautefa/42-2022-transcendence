import {
  Logger,
  Req,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { Message, Room, user } from 'src/bdd/index';
import { DeepPartial } from 'typeorm';
import { ChatExceptionFilter } from './chat-exception.filter';
import { ChatService } from './chat.service';
import { CreateMessageDto, CreateRoomDto, JoinRoomDto, UuidDto } from './dto';

// Not sure if this is going to be usefull to me ...
/*
const URL_BACK: string =
  process.env.REACT_APP_BACK_URL === undefined
    ? ''
    : process.env.REACT_APP_BACK_URL;
*/

@UseGuards(JwtAuthGuard)
@UseFilters(ChatExceptionFilter)
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
)
@WebSocketGateway({ cors: { origin: '*' }, namespace: 'chat' })
// implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}

  // The socket.io server responsible for handling (receiviing and emitting) events
  @WebSocketServer()
  server: Server;

  // A logger for debugging purposes
  private logger: Logger = new Logger('ChatGateway');

  // Create a message in the message table and inform the sockets in the room that a new message is available
  @SubscribeMessage('createMessage')
  async createMessage(
    @MessageBody() createMessageDto: CreateMessageDto,
    @Req() { user }: { user: user },
  ) {
    this.logger.log('Creating a message');
    const message = await this.chatService.createMessage(
      createMessageDto,
      user,
    );
    this.server.to(message.sender.room.id).emit('updateMessages', message);
    this.server.emit('updateRooms');
    return message;
  }

  // Create a room in the room table
  @SubscribeMessage('createRoom')
  async createRoom(
    @MessageBody() createRoomDto: CreateRoomDto,
    @Req() { user }: { user: user },
  ): Promise<Room> {
    this.logger.log('Here creating a room');
    const newRoom = await this.chatService.createRoom(createRoomDto, user);
    this.server.emit('updateRooms');
    return newRoom;
  }

  // Join a room previously created and return it
  @SubscribeMessage('joinRoom')
  async joinRoom(joinRoomDto: JoinRoomDto) {
    this.logger.log('Joining a room');
    const room: Room = await this.chatService.getRoomByName(
      joinRoomDto.roomName,
    );
    this.server.socketsJoin(joinRoomDto.roomName);
    return room;
  }

  // Join a DM room (create it if the room does not exist yet)
  @SubscribeMessage('joinDMRoom')
  async joinDMRoom(
    @MessageBody() joinDMRoomDto: UuidDto,
    @Req() { user }: { user: user },
  ): Promise<Room> {
    this.logger.log('req');
    const room: Room = await this.chatService.joinDMRoom(user, joinDMRoomDto);
    return room;
  }

  @SubscribeMessage('findAllMessagesInRoom')
  async findAllMessagesInRoom(
    @MessageBody() findAllMessagesInRoomDto: UuidDto,
  ): Promise<Message[]> {
    this.logger.log('Getting messages of room ', findAllMessagesInRoomDto.uuid);
    const messages: Message[] = await this.chatService.findAllMessagesInRoom(
      findAllMessagesInRoomDto,
    );
    return messages;
  }

  @SubscribeMessage('findLastMessageInRoom')
  async findLastMessageInRoom(
    @MessageBody() findLastMessageInRoomDto: UuidDto,
  ): Promise<Message> {
    const message: Message = await this.chatService.findLastMessageInRoom(
      findLastMessageInRoomDto,
    );
    return message;
  }
  /*
  // Add a new administrator to the room
  @SubscribeMessage('addAdmin')
  async addAdmin(newAdmin: user, roomId: string): Promise<Room> {
    const room: Room = await this.chatService.addAdmin(newAdmin, roomId);
    return room;
  }

  // Delete a room if user is the owner
  @SubscribeMessage('deleteRoom')
  async deleteRoom(
    roomId: string,
    @Req() { user }: { user: user },
  ): Promise<Room> {
    const room: Room = await this.chatService.deleteRoom(roomId, user);
    return room;
  }

  // Change the owner of the room
  @SubscribeMessage('changeOwnership')
  async changeOwnership(
    room_id: string,
    @Req() { user }: { user: user },
    newOwnerId: string,
  ): Promise<Room> {
    const room = await this.chatService.changeOwnership(
      room_id,
      user,
      newOwnerId,
    );
    return room;
  }
*/
  @SubscribeMessage('findAllPublicRooms')
  async findAllPublicRooms(): Promise<DeepPartial<Room>[]> {
    const rooms: DeepPartial<Room>[] =
      await this.chatService.findAllPublicRooms();
    return rooms;
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}
