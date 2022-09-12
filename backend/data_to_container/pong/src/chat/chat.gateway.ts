import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Room } from 'src/bdd/room.entity';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/createMessage.dto';
import { CreateRoomDto } from './dto/createRoom.dto';
import { JoinDMRoomDto } from './dto/joinDMRoom.dto';

@WebSocketGateway({ cors: '*' })
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('createMessage')
  async createMessage(
    @MessageBody()
    createMessageDto: CreateMessageDto,
  ) {
    try {
      const message = await this.chatService.createMessage(createMessageDto);
      this.server.to(message.room.id).emit('message', message);
      return message;
    } catch (error) {
      console.error(error);
    }
  }

  @SubscribeMessage('joinDMRoom')
  joinDMRoom(@MessageBody() joinDMRoomDto: JoinDMRoomDto): Room {
    try {
      const room: Room = this.chatService.getDMRoom(
        joinDMRoomDto.senderId,
        joinDMRoomDto.recipientId,
      );
      return room;
    } catch (err) {
      const room = this.chatService.createDMRoom(
        joinDMRoomDto.senderId,
        joinDMRoomDto.recipientId,
      );
      return room;
    }
  }

  @SubscribeMessage('createRoom')
  createRoom(@MessageBody() createRoomDto: CreateRoomDto) {
    this.chatService.createRoom(createRoomDto);
  }

  // joinRoom(roomName: string) {
  //   this.server.socketsJoin(roomName);
  //   return this.server.
  // }
}
