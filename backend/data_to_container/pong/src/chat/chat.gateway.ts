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
  OnGatewayConnection,
  OnGatewayDisconnect,
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
import { Authorized } from './decorator/authorized.decorator';
import { Roles } from './decorator/roles.decorator';
import { CreateMessageDto, CreateRoomDto, UuidDto } from './dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { GiveOwnershipDto } from './dto/give-ownership.dto';
import { PunishUserDto } from './dto/punish-user.dto';
import { RemovePunishmentDto } from './dto/remove-punishment.dto';
import { SetAdminDto } from './dto/set-admin.dto';
import { StringDto } from './dto/string.dto';
import { AuthorizedGuard } from './guard/authorized.guard';
import { ProtectedRoom } from './guard/protected-room.guard';
import { RolesGuard } from './guard/roles.guard';

@UseGuards(JwtAuthGuard)
@UseGuards(RolesGuard)
@UseGuards(AuthorizedGuard)
// @UseInterceptors(FilterHashInterceptor)
@UseFilters(ChatExceptionFilter)
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    // forbidNonWhitelisted: true,
  }),
)
@WebSocketGateway({ cors: { origin: process.env.REACT_APP_FRONT_URL, credentials: true }, namespace: 'chat' })
export class ChatGateway
  implements /*OnGatewayInit,*/ OnGatewayConnection, OnGatewayDisconnect
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
  ): Promise<string> {
    const roomId: string = await this.chatService.createMessage(
      createMessageDto,
      user,
    );
    this.logger.debug('Creating a message');
    console.log(roomId);
    this.server.to(roomId).emit('updateMessages');
    this.server.emit('updateRooms');
    return roomId;
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
  async joinRoom(@MessageBody() joinRoomDto: UuidDto) {
    this.logger.debug('pouet');
    const room: Room = await this.chatService.findRoomById(joinRoomDto.uuid);
    this.server.socketsJoin(room.id);
    return room;
  }

  @Authorized('notBanned')
  @SubscribeMessage('joinPrivateRoom')
  async joinPrivateRoom(@MessageBody() joinPrivateRoomDto: StringDto) {
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
    const room: Room = await this.chatService.joinDMRoom(user, joinDMRoomDto);
    this.server.socketsJoin(joinDMRoomDto.uuid);
    return room;
  }

  @Authorized('notBanned')
  @SubscribeMessage('findAllMessagesInRoom')
  async findAllMessagesInRoom(
    @MessageBody() findAllMessagesInRoomDto: UuidDto,
  ): Promise<Message[]> {
    const messages: Message[] = await this.chatService.findAllMessagesInRoom(
      findAllMessagesInRoomDto,
    );
    console.log(messages);
    return messages;
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
  async deleteRoom(@MessageBody() deleteRoomDto: UuidDto): Promise<Room> {
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
    @MessageBody() removePunishmentDto: RemovePunishmentDto,
  ): Promise<ChatMember> {
    return await this.chatService.removePunishment(removePunishmentDto);
  }

  @SubscribeMessage('findAllPublicRooms')
  async findAllPublicRooms(): Promise<DeepPartial<Room>[]> {
    return await this.chatService.findAllPublicRooms();
  }

  handleConnection(client: Socket, ...args: any[]) {
    // const user = { id: 'mock' };
    this.logger.debug(`client connected: ${client.id}`);
    if (client.handshake.headers.cookie)
      this.logger.debug('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH!!!');
  }

  handleDisconnect(client: Socket) {}
}
