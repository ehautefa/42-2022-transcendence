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
import { ChatMember, Message, Room, user } from 'src/bdd/index';
import { DeepPartial } from 'typeorm';
import { ChatExceptionFilter } from './chat-exception.filter';
import { ChatService } from './chat.service';
import { Roles } from './decorator/roles.decorator';
import { CreateMessageDto, CreateRoomDto, UuidDto } from './dto';
import { SetAdminDto } from './dto/set-admin.dto';
import { StringDto } from './dto/string.dto';
import { RolesGuard } from './guard/roles.guard';

@UseGuards(JwtAuthGuard)
@UseGuards(RolesGuard)
@UseFilters(ChatExceptionFilter)
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    // forbidNonWhitelisted: true,
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

  @SubscribeMessage('joinRoom')
  async joinRoom(joinRoomDto: UuidDto) {
    const room: Room = await this.chatService.findRoomById(joinRoomDto.uuid);
    this.server.socketsJoin(room.id);
    this.logger.log(`Joined ${room.name} room (${room.id})`);
    return room;
  }

  @SubscribeMessage('joinPrivateRoom')
  async joinPrivateRoom(joinPrivateRoomDto: StringDto) {
    const room: Room = await this.chatService.joinPrivateRoom(
      joinPrivateRoomDto,
    );
    this.server.socketsJoin(room.id);
    this.logger.log(`Joined ${room.name} room (${room.id})`);
    return room;
  }

  @SubscribeMessage('joinDMRoom')
  async joinDMRoom(
    @MessageBody() joinDMRoomDto: UuidDto,
    @Req() { user }: { user: user },
  ): Promise<Room> {
    this.logger.log('req');
    const room: Room = await this.chatService.joinDMRoom(user, joinDMRoomDto);
    this.server.socketsJoin(joinDMRoomDto.uuid);
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

  @Roles('owner', 'admin')
  @SubscribeMessage('setAdmin')
  async addAdmin(@MessageBody() setAdminDto: SetAdminDto): Promise<ChatMember> {
    const chatMember: ChatMember = await this.chatService.setAdmin(setAdminDto);
    return chatMember;
  }

  // @Roles('owner')
  // @SubscribeMessage('giveOwnership')
  // async changeOwnership(room_id: string, newOwnerId: string): Promise<Room> {
  //   const room = await this.chatService.changeOwnership(
  //     room_id,
  //     user,
  //     newOwnerId,
  //   );
  //   return room;
  // }

  /*
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
  }
*/
  @SubscribeMessage('findAllPublicRooms')
  async findAllPublicRooms(): Promise<DeepPartial<Room>[]> {
    const rooms: DeepPartial<Room>[] =
      await this.chatService.findAllPublicRooms();
    return rooms;
  }

  afterInit(server: Server) {
    this.logger.log(`Init`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}
