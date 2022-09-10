import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatService } from './chat.service';
import { MessageDto } from './dto/message.dto';

@WebSocketGateway({ cors: '*' })
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  server: Server;
  
  @SubscribeMessage('createMessage')
  sendMessage(@MessageBody() messageDto: MessageDto, @ConnectedSocket() client){
      // this.chatService.sendMessage(messageDto)
      this.server.to(client.)
  }

  @SubscribeMessage('createMessage')
  createMessage(@MessageBody() messageDto: MessageDto) {
    return this.chatService.createMessage(messageDto);
  }

  @SubscribeMessage('createRoom')
  createRoom() {}

  joinRoom(roomName: string) {
    this.server.socketsJoin(roomName);
    return this.server.
  }
}
