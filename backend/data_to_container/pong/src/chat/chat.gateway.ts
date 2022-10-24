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
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
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
import { Authorized, Roles } from './decorator';
import {
  ChangePasswordDto,
  CreateMessageDto,
  CreateRoomDto,
  GiveOwnershipDto,
  PunishUserDto,
  RemovePunishmentDto,
  SetAdminDto,
  StringDto,
  UuidDto,
} from './dto';
import { AuthorizedGuard, ProtectedRoom, RolesGuard } from './guard';
import { FilterHashInterceptor } from './interceptor/filter-hash.interceptor';

@UseGuards(JwtAuthGuard)
@UseGuards(RolesGuard)
@UseGuards(AuthorizedGuard)
@UseInterceptors(FilterHashInterceptor)
@UseFilters(ChatExceptionFilter)
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    // forbidNonWhitelisted: true,
  }),
)
@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    // methods: ['GET', 'POST'],
    credentials: true,
  },
  namespace: 'chat',
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly chatService: ChatService) {}

  // The socket.io server responsible for handling (receiviing and emitting) events
  @WebSocketServer()
  server: Server;

  // A logger for debugging purposes
  private logger: Logger = new Logger('ChatGateway');

  @Authorized('notBanned', 'notBlocked', 'notMuted')
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
    this.server.socketsJoin(newRoom.id);
    this.server.emit('updateRooms');
    return newRoom;
  }

  @Authorized('notBanned')
  @SubscribeMessage('joinRoom')
  async joinRoom(joinRoomDto: UuidDto) {
    const room: Room = await this.chatService.findRoomById(joinRoomDto.uuid);
    this.server.socketsJoin(room.id);
    return room;
  }

  @Authorized('notBanned')
  @SubscribeMessage('joinPrivateRoom')
  async joinPrivateRoom(joinPrivateRoomDto: StringDto) {
    const room: Room = await this.chatService.joinPrivateRoom(
      joinPrivateRoomDto,
    );
    this.server.socketsJoin(room.id);
    return room;
  }

  @Authorized('notBlocked')
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

  @Authorized('notBanned')
  @SubscribeMessage('findAllMessagesInRoom')
  async findAllMessagesInRoom(
    @MessageBody() findAllMessagesInRoomDto: UuidDto,
  ): Promise<Message[]> {
    return await this.chatService.findAllMessagesInRoom(
      findAllMessagesInRoomDto,
    );
  }

  @Authorized('notBanned')
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

  @Roles('admin')
  async punishUser(
    @MessageBody() punishUserDto: PunishUserDto,
  ): Promise<ChatMember> {
    return await this.chatService.punishUser(punishUserDto);
  }

  @Roles('admin')
  async removePunishment(
    removePunishmentDto: RemovePunishmentDto,
  ): Promise<ChatMember> {
    return await this.chatService.removePunishment(removePunishmentDto);
  }

  @SubscribeMessage('findAllJoinedRooms')
  async findAllJoinedRooms(
    @ConnectedSocket() { rooms }: { rooms: Set<string> },
  ): Promise<DeepPartial<Room>[]> {
    return await this.chatService.findAllJoinedRooms(rooms);
  }

  afterInit() {
    this.logger.log(`Socket.io server initialized`);
  }

  handleConnection(client: any) {
    this.logger.log(`New client connected: ${client.id}`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
