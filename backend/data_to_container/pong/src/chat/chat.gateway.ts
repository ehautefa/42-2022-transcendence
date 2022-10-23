import {
  Logger,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { ChatMember, Message, Room, user } from 'src/bdd/index';
import { DeepPartial } from 'typeorm';
import { ChatExceptionFilter } from './chat-exception.filter';
import { ChatService } from './chat.service';
import { Roles } from './decorator/roles.decorator';
import { CreateMessageDto, CreateRoomDto, UuidDto } from './dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { GiveOwnershipDto } from './dto/give-ownership.dto';
import { SetAdminDto } from './dto/set-admin.dto';
import { StringDto } from './dto/string.dto';
import { ProtectedRoom } from './guard/protected-room.guard';
import { RolesGuard } from './guard/roles.guard';
import { FilterHashInterceptor } from './interceptor/filter-hash.interceptor';

@UseGuards(JwtAuthGuard)
@UseGuards(RolesGuard)
@UseInterceptors(FilterHashInterceptor)
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
  ): Promise<DeepPartial<Room>> {
    const newRoom: DeepPartial<Room> = await this.chatService.createRoom(
      createRoomDto,
      user,
    );
    this.server.emit('updateRooms');
    return newRoom;
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(joinRoomDto: UuidDto) {
    const room: Room = await this.chatService.findRoomById(joinRoomDto.uuid);
    this.server.socketsJoin(room.id);
    return room;
  }

  @SubscribeMessage('joinPrivateRoom')
  async joinPrivateRoom(joinPrivateRoomDto: StringDto) {
    const room: Room = await this.chatService.joinPrivateRoom(
      joinPrivateRoomDto,
    );
    this.server.socketsJoin(room.id);
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
    return await this.chatService.findAllMessagesInRoom(
      findAllMessagesInRoomDto,
    );
  }

  @SubscribeMessage('findLastMessageInRoom')
  async findLastMessageInRoom(
    @MessageBody() findLastMessageInRoomDto: UuidDto,
  ): Promise<Message> {
    return await this.chatService.findLastMessageInRoom(
      findLastMessageInRoomDto,
    );
  }

  @Roles('owner', 'admin')
  @SubscribeMessage('setAdmin')
  async addAdmin(@MessageBody() setAdminDto: SetAdminDto): Promise<ChatMember> {
    return await this.chatService.setAdmin(setAdminDto);
  }

  @Roles('owner')
  @SubscribeMessage('giveOwnership')
  async changeOwnership(
    @MessageBody() giveOwnershipDto: GiveOwnershipDto,
  ): Promise<Room> {
    return await this.chatService.giveOwnership(giveOwnershipDto);
  }

  @Roles('owner')
  @SubscribeMessage('deleteRoom')
  async deleteRoom(deleteRoomDto: UuidDto): Promise<Room> {
    return await this.chatService.deleteRoom(deleteRoomDto);
  }

  @Roles('owner')
  @UseGuards(ProtectedRoom)
  @SubscribeMessage('changePassword')
  async changePassword(
    @MessageBody() changePasswordDto: ChangePasswordDto,
  ): Promise<Room> {
    return await this.chatService.changePassword(changePasswordDto);
  }

  @SubscribeMessage('findAllPublicRooms')
  async findAllPublicRooms(): Promise<DeepPartial<Room>[]> {
    return await this.chatService.findAllPublicRooms();
  }
}
