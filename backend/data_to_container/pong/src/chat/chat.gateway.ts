import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/createMessage.dto';
import { createRoomDto } from './dto/createRoom.dto';

@WebSocketGateway({ cors: '*' })
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('createMessage')
  async createMessage(@MessageBody() createMessageDto: CreateMessageDto) {
    try {
      const message = await this.chatService.createMessage(createMessageDto);
      this.server.to(message.room.name).emit('message', message);
      return message;
    } catch (error) {
      console.error(error);
    }
  }

  @SubscribeMessage('createRoom')
  createRoom(@MessageBody() createRoomDto: createRoomDto, client: Socket) {
    this.chatService.createRoom(createRoomDto);
  }

  // joinRoom(roomName: string) {
  //   this.server.socketsJoin(roomName);
  //   return this.server.
  // }
}
