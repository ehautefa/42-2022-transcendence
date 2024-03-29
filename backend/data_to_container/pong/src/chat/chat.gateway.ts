import {
  Logger,
  Req,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ConnectedSocket,
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
import { ChatExceptionFilter } from './chat-exception.filter';
import { ChatService } from './chat.service';
import { Authorized } from './decorator/authorized.decorator';
import {
  CreateMessageDto,
  CreateRoomDto,
  DoubleUuidDto,
  FilterByAdminRightsDto,
  JoinRoomDto,
  PunishUserDto,
  RemovePunishmentDto,
  RespondToInvitationDto,
  SetAdminDto,
  UuidDto,
} from './dto';
import { ChangePasswordDto } from './dto/';
import { AuthorizedGuard } from './guard/authorized.guard';
import { ProtectedRoomGuard } from './guard/protected-room.guard';
import { RolesGuard } from './guard/roles.guard';

@UseGuards(JwtAuthGuard)
@UseGuards(RolesGuard)
@UseGuards(AuthorizedGuard)
@UseFilters(ChatExceptionFilter)
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    // forbidNonWhitelisted: true,
  }),
)
@WebSocketGateway({
  cors: { origin: process.env.REACT_APP_FRONT_URL, credentials: true },
  namespace: 'chat',
})
export class ChatGateway
  implements /*OnGatewayInit,*/ OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatService: ChatService) { }

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
  ): Promise<Message> {
    const message: Message = await this.chatService.createMessage(
      createMessageDto,
      user,
    );
    // this.logger.debug('Creating a message');
    // this.logger.debug(message.sender.room.id);
    this.server
      .in(message.sender.room.id)
      .emit('updateMessages', message.sender.room.id);
    this.server.to(message.sender.room.id).emit('updateRooms');
    return message;
  }

  @SubscribeMessage('createRoom')
  async createRoom(
    @MessageBody() createRoomDto: CreateRoomDto,
    @Req() { user }: { user: user },
  ): Promise<Room> {
    const newRoom: Room = await this.chatService.createRoom(
      createRoomDto,
      user,
    );
    this.server.socketsJoin(newRoom.id);
    this.server.emit('updateRooms');
    return newRoom;
  }

  @UseGuards(ProtectedRoomGuard)
  @SubscribeMessage('joinRoom')
  async joinRoom(
    @MessageBody() joinRoomDto: JoinRoomDto,
    @Req() { user }: { user: user },
  ) {
    const chatMember: ChatMember = await this.chatService.joinRoom(
      joinRoomDto,
      user,
    );
    this.server.socketsJoin(chatMember.room.id);
    this.server.emit('updateRooms');
    this.logger.log(
      `User ${user.userUuid} is joining room ${joinRoomDto.roomId}`,
    );

    return chatMember;
  }

  /*
  @Authorized('notBanned')
  @SubscribeMessage('joinPrivateRoom')
  async joinPrivateRoom(@MessageBody() joinPrivateRoomDto: StringDto) {
    const room: Room = await this.chatService.joinPrivateRoom(
      joinPrivateRoomDto,
    );
    this.server.socketsJoin(room.id);
    return room;
  }
  */

  // @Authorized('notBlocked')
  //return the room id
  @SubscribeMessage('joinDMRoom')
  async joinDMRoom(
    @MessageBody() recipiendId: UuidDto,
    @Req() { user }: { user: user },
  ): Promise<string> {
    const room: Room = await this.chatService.getDMRoom(user, recipiendId.uuid);
    this.server.socketsJoin(room.id);
    return room.id;
  }

  // @Authorized('notBanned')
  @SubscribeMessage('findAllMessagesInRoom')
  async findAllMessagesInRoom(
    @MessageBody() findAllMessagesInRoomDto: UuidDto,
  ): Promise<Message[]> {
    const messages: Message[] = await this.chatService.findAllMessagesInRoom(
      findAllMessagesInRoomDto,
    );
    return messages;
  }

  @SubscribeMessage('findBannableUsersInRoom')
  async findBannableUsersInRoom(
    @MessageBody() roomId: UuidDto,
    @Req() { user }: { user: user },
  ): Promise<user[]> {
    return await this.chatService.findBannableUsersInRoom(
      user.userUuid,
      roomId.uuid,
    );
  }

  @SubscribeMessage('findMutableUsersInRoom')
  async findMutableUsersInRoom(
    @MessageBody() roomId: UuidDto,
    @Req() { user }: { user: user },
  ): Promise<user[]> {
    return await this.chatService.findBannableUsersInRoom(
      user.userUuid,
      roomId.uuid,
    );
  }

  // @Roles('owner', 'admin')
  // @UseGuards(ProtectedRoomGuard) // je suis vraiment désolé Romain
  @SubscribeMessage('setAdmin')
  async addAdmin(@MessageBody() setAdminDto: SetAdminDto): Promise<ChatMember> {
    const chatMember = await this.chatService.setAdmin(setAdminDto);
    this.server.emit('updateRooms');
    return chatMember;
  }

  //@Roles('owner')
  //@UseGuards(ProtectedRoomGuard)
  @SubscribeMessage('giveOwnership')
  async giveOwnership(
    @MessageBody() giveOwnershipDto: DoubleUuidDto,
  ): Promise<Room> {
    const room: Room = await this.chatService.giveOwnership(giveOwnershipDto);
    this.server.emit('updateRooms');
    return room;
  }

  // @Roles('owner')
  // @UseGuards(ProtectedRoomGuard)
  @SubscribeMessage('deleteRoom')
  async deleteRoom(@MessageBody() deleteRoomDto: UuidDto): Promise<Room> {
    const room: Room = await this.chatService.deleteRoom(deleteRoomDto.uuid);
    this.server.to(deleteRoomDto.uuid).emit('refreshSelectedRoom');
    this.server.to(room.id).socketsLeave(deleteRoomDto.uuid);
    return room;
  }

  // @Roles('owner')
  @UseGuards(ProtectedRoomGuard)
  @SubscribeMessage('changePassword')
  async changePassword(
    @MessageBody() changePasswordDto: ChangePasswordDto,
  ): Promise<Room> {
    const room: Room = await this.chatService.changePassword(changePasswordDto);
    this.server.emit('updateRooms');
    return room;
  }

  // @Roles('admin')
  @SubscribeMessage('punishUser')
  async punishUser(
    @MessageBody() punishUserDto: PunishUserDto,
  ): Promise<ChatMember> {
    const chatMember = await this.chatService.punishUser(punishUserDto);
    chatMember.bannedTime =
      chatMember.bannedTime !== null &&
      (chatMember.bannedTime as Date).getTime() > new Date().getTime()
        ? true
        : false;
    chatMember.mutedTime =
      chatMember.mutedTime !== null &&
      (chatMember.mutedTime as Date).getTime() > new Date().getTime()
        ? true
        : false;
    chatMember.id = chatMember.room.id;
    this.server.to(chatMember.room.id).emit('updateRooms');
    return chatMember;
  }

  // @Roles('admin')
  @SubscribeMessage('removePunishment')
  async removePunishment(
    @MessageBody() removePunishmentDto: RemovePunishmentDto,
  ): Promise<ChatMember> {
    const chatMember = await this.chatService.removePunishment(
      removePunishmentDto,
    );
    chatMember.bannedTime =
      chatMember.bannedTime !== null &&
      (chatMember.bannedTime as Date).getTime() > new Date().getTime()
        ? true
        : false;
    chatMember.mutedTime =
      chatMember.mutedTime !== null &&
      (chatMember.mutedTime as Date).getTime() > new Date().getTime()
        ? true
        : false;
    chatMember.id = chatMember.room.id;
    this.server.to(chatMember.room.id).emit('updateRooms');
    return chatMember;
  }

  @SubscribeMessage('findAllJoinedRooms')
  async findAllJoinedRooms(
    @Req() { user }: { user: user },
  ): Promise<ChatMember[]> {
    return await this.chatService.findAllJoinedRooms(user.userUuid);
  }

  @SubscribeMessage('findAllUsersInRoom')
  async findAllUsersInRoom(
    @MessageBody() roomId: UuidDto,
    @Req() { user }: { user: user },
  ) {
    return await this.chatService.findAllUsersInRoom(
      user.userUuid,
      roomId.uuid,
    );
  }

  @SubscribeMessage('findAllJoinableRooms')
  async findAllPublicOrProtectedRooms(
    @Req() { user }: { user: user },
  ): Promise<Room[]> {
    return await this.chatService.findAllJoinableRooms(user.userUuid);
  }

  @SubscribeMessage('leaveRoom')
  async leaveRoom(
    @MessageBody() roomId: UuidDto,
    @Req() { user }: { user: user },
    @ConnectedSocket() client: Socket,
  ): Promise<ChatMember> {
    const chatMember: ChatMember = await this.chatService.leaveRoom(
      user.userUuid,
      roomId.uuid,
    );
    this.server.to(client.id).emit('refreshSelectedRoom');
    this.server.to(roomId.uuid).emit('updateRooms');
    return chatMember;
  }

  @SubscribeMessage('findAllInvitableUsers')
  async findAllInvitableUsers(@MessageBody() roomId: UuidDto): Promise<user[]> {
    return await this.chatService.findAllInvitableUsers(roomId.uuid);
  }

  @SubscribeMessage('filterByAdminRightsInRoom')
  async findAdminsInRoom(
    @MessageBody() filterByAdminRightsDto: FilterByAdminRightsDto,
    @Req() { user }: { user: user },
  ): Promise<ChatMember[]> {
    return await this.chatService.filterByAdminRightsInRoom(
      filterByAdminRightsDto,
      user.userUuid,
    );
  }

  @SubscribeMessage('findBannedUsersInRoom')
  async findBannedUsersInRoom(
    @MessageBody() roomId: UuidDto,
  ): Promise<ChatMember[]> {
    return await this.chatService.findBannedUsersInRoom(roomId.uuid);
  }

  @SubscribeMessage('amIAdmin')
  async amIAdmin(
    @MessageBody() roomId: UuidDto,
    @Req() { user }: { user: user },
  ): Promise<boolean> {
    return await this.chatService.amIAdmin(user.userUuid, roomId.uuid);
  }

  @SubscribeMessage('amIOwner')
  async amIOwner(
    @MessageBody() roomId: UuidDto,
    @Req() { user }: { user: user },
  ): Promise<boolean> {
    return await this.chatService.amIOwner(user.userUuid, roomId.uuid);
  }

  @SubscribeMessage('findMutedUsersInRoom')
  async findMutedUsersInRoom(
    @MessageBody() roomId: UuidDto,
  ): Promise<ChatMember[]> {
    return await this.chatService.findMutedUsersInRoom(roomId.uuid);
  }

  @SubscribeMessage('inviteUser')
  async inviteUser(@MessageBody() inviteUserDto: DoubleUuidDto): Promise<user> {
    const usr: user = await this.chatService.inviteUser(
      inviteUserDto.userId,
      inviteUserDto.roomId,
    );
    return usr;
  }

  @SubscribeMessage('getPendingInvitations')
  async getPendingInvitations(
    @Req() { user }: { user: user },
  ): Promise<Room[]> {
    return await this.chatService.getPendingInvitations(user.userUuid);
  }

  @SubscribeMessage('respondToInvitation')
  async respondToInvitation(
    @MessageBody() respondToInvitationDto: RespondToInvitationDto,
    @Req() { user }: { user: user },
    @ConnectedSocket() client: Socket,
  ) {
    const usr: user = await this.chatService.respondToInvitation(
      respondToInvitationDto,
      user,
    );
    if (respondToInvitationDto.acceptInvitation === true) {
      this.server.socketsJoin(respondToInvitationDto.roomId);
      this.server.to(respondToInvitationDto.roomId).emit('updateRooms');
    }
    this.server.to(client.id).emit('updatePending');
    return usr;
  }

  async handleConnection(client: Socket): Promise<void> {
    this.logger.log(`client connected: ${client.id}`);
    const cookie: string = client.handshake.headers.cookie;
    if (
      cookie !== undefined &&
      cookie !== null &&
      cookie !== '' &&
      cookie.includes('access_token=')
    ) {
      const accessToken: string = cookie
        .split('; ')
        .find((cookie: string) => cookie.startsWith('access_token='))
        .split('=')[1];
      if (accessToken === "")
        return
      const roomsToJoin: ChatMember[] = await this.chatService.handleConnection(
        client.handshake.headers.cookie,
      );
      for (const room of roomsToJoin) {
        this.server.socketsJoin(room.room.id);
      }
    }
  }

  handleDisconnect(client: Socket): void {
    const roomsToLeave: Set<string> = client.rooms;
    roomsToLeave.forEach((room) => {
      this.server.socketsLeave(room);
    });
  }
}
