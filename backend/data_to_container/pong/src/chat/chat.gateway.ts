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
  async joinDMRoom(@MessageBody() joinDMRoomDto: JoinDMRoomDto): Promise<Room> {
    try {
      const room: Room = await this.chatService.getDMRoom(
        joinDMRoomDto.senderId,
        joinDMRoomDto.recipientId,
      );
      return room;
    } catch (err) {
      try {
        const room = await this.chatService.createDMRoom(
          joinDMRoomDto.senderId,
          joinDMRoomDto.recipientId,
        );
        return room;
      } catch (error) {
        console.error(error);
      }
    }
  }

  @SubscribeMessage('createRoom')
  async createRoom(@MessageBody() createRoomDto: CreateRoomDto) {
    try {
      const newRoom = await this.chatService.createRoom(createRoomDto);
      return newRoom;
    } catch (error) {
      console.error(error);
    }
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(roomName: string) {
    try {
      const room: Room = await this.chatService.getRoomByName(roomName);
      this.server.socketsJoin(roomName);
      return room;
    } catch (error) {
      console.error(error);
    }
  }

  @SubscribeMessage('findPublicRooms')
  async findAllPublicRooms(): Promise<Room[]> {
    const rooms: Room[] = await this.chatService.findAllPublicRooms();
    return rooms;
  }
}
