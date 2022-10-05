import { Logger, Req, UseGuards } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { Message } from 'src/bdd/message.entity';
import { Room } from 'src/bdd/room.entity';
import { user } from 'src/bdd/users.entity';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/createMessage.dto';
import { CreateRoomDto } from './dto/createRoom.dto';
import { JoinDMRoomDto } from './dto/joinDMRoom.dto';

// Not sure if this is going to be usefull to me ...
/*
const URL_BACK: string =
  process.env.REACT_APP_BACK_URL === undefined
    ? ''
    : process.env.REACT_APP_BACK_URL;
*/

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
  async createMessage(@MessageBody() createMessageDto: CreateMessageDto) {
    this.logger.log('Creating a message');
    const message = await this.chatService.createMessage(createMessageDto);
    this.server.to(message.room.id).emit('message', message);
    return message;
  }

  // Create a room in the room table
  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('createRoom')
  async createRoom(
    @MessageBody() createRoomDto: CreateRoomDto,
    @Req() req,
  ): Promise<Room> {
    this.logger.log('Here creating a room');
    console.log(createRoomDto);
    const newRoom = await this.chatService.createRoom(createRoomDto, req.user);
    return newRoom;
  }

  // Join a room previously created and return it
  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('joinRoom')
  async joinRoom(roomName: string) {
    const room: Room = await this.chatService.getRoomByName(roomName);
    this.server.socketsJoin(roomName);
    return room;
  }

  // Join a DM room (create it if the room does not exist yet)
  @SubscribeMessage('joinDMRoom')
  @UseGuards(JwtAuthGuard)
  async joinDMRoom(
    @MessageBody() joinDMRoomDto: JoinDMRoomDto,
    @Req() req,
  ): Promise<Room> {
    this.logger.log(req);
    console.log(req);
    const room: Room = await this.chatService.joinDMRoom(
      req.user.userUuid,
      joinDMRoomDto.recipientId,
    );
    return room;
  }

  @SubscribeMessage('getAllMessagesInRoom')
  async getAllMessagesInRoom(roomId: string): Promise<Message[]> {
    this.logger.log('Getting messages of room ', roomId);
    const messages: Message[] = await this.chatService.getAllMessagesInRoom(
      roomId,
    );
    return messages;
  }

  // Add a new administrator to the room
  @SubscribeMessage('addAdmin')
  async addAdmin(newAdmin: user, roomId: string): Promise<Room> {
    const room: Room = await this.chatService.addAdmin(newAdmin, roomId);
    return room;
  }

  // Delete a room if user is the owner
  @SubscribeMessage('deleteRoom')
  async deleteRoom(roomId: string, @Req() req): Promise<Room> {
    const room: Room = await this.chatService.deleteRoom(roomId, req.user);
    return room;
  }

  // Change the owner of the room
  @SubscribeMessage('changeOwnership')
  async changeOwnership(
    room_id: string,
    @Req() req,
    newOwnerId: string,
  ): Promise<Room> {
    const room = await this.chatService.changeOwnership(
      room_id,
      req.user,
      newOwnerId,
    );
    return room;
  }

  @SubscribeMessage('findAllPublicRooms')
  async findAllPublicRooms(): Promise<Room[]> {
    const rooms: Room[] = await this.chatService.findAllPublicRooms();
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
