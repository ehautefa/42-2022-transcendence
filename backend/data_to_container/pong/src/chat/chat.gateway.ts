import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { Room } from 'src/bdd/room.entity';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/createMessage.dto';
import { CreateRoomDto } from './dto/createRoom.dto';
import { JoinDMRoomDto } from './dto/joinDMRoom.dto';

const URL_BACK: string = process.env.REACT_APP_BACK_URL === undefined ? "" : process.env.REACT_APP_BACK_URL;;

@WebSocketGateway({ cors: { origin: "*"}, namespace: 'chat' })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('PongGateway');

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