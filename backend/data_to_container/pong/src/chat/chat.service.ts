import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { WsException } from '@nestjs/websockets';
import * as argon from 'argon2';
import { JwtConfig } from 'src/auth/config/Jwt.config';
import TokenPayload from 'src/auth/tokenPayload.interface';
import { ChatMember, Message, Room, RoomType, user } from 'src/bdd/';
import { UserService } from 'src/user/user.service';
import { IsNull, LessThan, Not, Repository } from 'typeorm';
import {
  ChangePasswordDto,
  CreateMessageDto,
  CreateRoomDto,
  DoubleUuidDto,
  FilterByAdminRightsDto,
  JoinRoomDto,
  PunishUserDto,
  RemovePunishmentDto,
  RespondToInvitationDto,
  SetAdminDto,
} from './dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
    @InjectRepository(ChatMember)
    private chatMembersRepository: Repository<ChatMember>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private eventEmitter: EventEmitter2,
  ) {}

  // A logger for debugging purposes
  private logger: Logger = new Logger('ChatService');

  /*
   ** message functions
   */

  async createMessage(
    createMessageDto: CreateMessageDto,
    sender: user,
  ): Promise<Message> {
    const room: Room = await this.findRoomById(createMessageDto.roomId);
    const chatMember: ChatMember = await this.getChatMember(sender, room);
    const newMessage = this.messagesRepository.create({
      message: createMessageDto.message,
      sender: chatMember,
      time: new Date(),
    });
    this.logger.debug('createMessage is OK');
    this.logger.debug(chatMember);
    return await this.messagesRepository.save(newMessage);
  }

  async findAllMessagesInRoom({
    uuid: roomId,
  }: {
    uuid: string;
  }): Promise<any[]> {
    // console.log('roomId = ', roomId);
    const messages: Message[] = await this.messagesRepository
      .createQueryBuilder('msg')
      .innerJoin('msg.sender', 'sender')
      .innerJoin('sender.room', 'room')
      .innerJoin('sender.user', 'user')
      .where('room.id = :id', { id: roomId })
      .select('message')
      .addSelect('user.userName', 'userName')
      .addSelect('msg.id', 'id')
      .orderBy('msg.time')
      .getRawMany();
    return messages;
  }

  // async findLastMessageInRoom(roomIdDto: UuidDto): Promise<Message> {
  //   const messages: Message[] = await this.findAllMessagesInRoom(roomIdDto);
  //   return messages[messages.length - 1];
  // }

  /*
   * chatMember functions
   */

  async getChatMember(user: user, room: Room): Promise<ChatMember> {
    try {
      return await this.findChatMember(user.userUuid, room.id);
    } catch (error) {
      return await this.createChatMember(user, room);
    }
  }

  async findChatMember(userId: string, roomId: string): Promise<ChatMember> {
    const chatMember: ChatMember = await this.chatMembersRepository.findOne({
      relations: {
        user: true,
        room: true,
      },
      where: {
        user: { userUuid: userId },
        room: { id: roomId },
      },
    });
    return chatMember;
  }

  async createChatMember(user: user, room: Room): Promise<ChatMember> {
    const chatMember: ChatMember = this.chatMembersRepository.create({
      user: user,
      room: room,
    });
    await this.chatMembersRepository.save(chatMember);
    return chatMember;
  }

  /*
   * room functions
   */

  async createRoom(createRoomDto: CreateRoomDto, owner: user): Promise<Room> {
    const hash: string = !createRoomDto.password
      ? ''
      : await argon.hash(createRoomDto.password);
    let newRoom: Room = this.roomsRepository.create({
      name: createRoomDto.name,
      hash: hash,
      type: createRoomDto.type,
    });
    newRoom = await this.roomsRepository.save(newRoom);
    const chatMember: ChatMember = await this.createChatMember(owner, newRoom);
    chatMember.isAdmin = true;
    await this.chatMembersRepository.save(chatMember);
    newRoom.owner = chatMember;
    return await this.roomsRepository.save(newRoom);
  }

  async findAllJoinableRooms(userId: string): Promise<Room[]> {
    const allRoom: Room[] = await this.roomsRepository
      .createQueryBuilder('room')
      .select('room.id', 'id')
      .addSelect('room.name', 'name')
      .addSelect('room.type', 'type')
      .where('room.type = :public', { public: RoomType.PUBLIC })
      .orWhere('room.type = :protected', { protected: RoomType.PROTECTED })
      .getRawMany();
    const joinedRoom = await this.chatMembersRepository
      .createQueryBuilder('members')
      .innerJoin('members.user', 'user')
      .innerJoin('members.room', 'room')
      .where('user.userUuid = :usrId', { usrId: userId })
      .select('room.id', 'id')
      .getRawMany();
    return allRoom.filter(
      (room) => !joinedRoom.find((elem) => elem.id === room.id),
    );
  }

  async findRoomById(roomId: string): Promise<Room> {
    const room: Room = await this.roomsRepository.findOneOrFail({
      where: { id: roomId },
    });
    return room;
  }

  async findRoomByName(roomName: string): Promise<Room> {
    return await this.roomsRepository.findOneOrFail({
      where: { name: roomName },
    });
  }

  async joinRoom(joinRoomDto: JoinRoomDto, user: user): Promise<ChatMember> {
    const room: Room = await this.findRoomById(joinRoomDto.roomId);
    return await this.createChatMember(user, room);
  }

  async leaveRoom(userId: string, roomId: string): Promise<ChatMember> {
    const chatMember: ChatMember =
      await this.chatMembersRepository.findOneOrFail({
        relations: {
          room: { owner: { user: true } },
          user: true,
        },
        where: {
          user: { userUuid: userId },
          room: { id: roomId },
        },
      });
    if (chatMember.room.owner.user.userUuid === chatMember.user.userUuid)
      throw new WsException('You cannot leave a room you own');
    if (chatMember.bannedTime && chatMember.bannedTime < new Date())
      throw new WsException('You cannot leave a room you are banned from');
    if (chatMember.mutedTime && chatMember.mutedTime < new Date())
      throw new WsException('You cannot leave a room you are muted in');
    this.chatMembersRepository.delete(chatMember.id);
    return chatMember;
  }

  async findAllJoinedRooms(userId: string): Promise<ChatMember[]> {
    const chatMember: ChatMember[] = await this.chatMembersRepository
      .createQueryBuilder('members')
      .innerJoin('members.room', 'room')
      .innerJoin('members.user', 'user')
      .where('user.userUuid = :userId', { userId: userId })
      .select('room.id', 'id')
      .addSelect('room.name', 'name')
      .addSelect('room.type', 'type')
      .addSelect('members.mutedTime', 'mutedTime')
      .addSelect('members.bannedTime', 'bannedTime')
      .getRawMany();
    chatMember.map((mbr) => {
      mbr.bannedTime =
        mbr.bannedTime && mbr.bannedTime < new Date() ? true : false;
      mbr.mutedTime =
        mbr.mutedTime && mbr.mutedTime < new Date() ? true : false;
    });
    return chatMember;
  }

  async findAllInvitableUsers(roomId: string): Promise<user[]> {
    const users: user[] = await this.userService.getAllUser();
    const chatMembers: ChatMember[] = await this.chatMembersRepository.find({
      relations: { user: true, room: true },
      select: { user: { userUuid: true } },
      where: { room: { id: roomId } },
    });
    return users.filter(
      (user) =>
        !chatMembers.find((member) => user.userUuid === member.user.userUuid),
    );
  }

  async inviteUser(userId: string, roomId: string): Promise<user> {
    const room: Room = await this.findRoomById(roomId);
    this.eventEmitter.emit('room.invite', userId);
    return await this.userService.addInvitation(userId, room);
  }

  async respondToInvitation(
    respondToInvitationDto: RespondToInvitationDto,
    user: user,
  ): Promise<user> {
    const room: Room = await this.findRoomById(respondToInvitationDto.roomId);
    if (respondToInvitationDto.acceptInvitation === true)
      this.createChatMember(user, room);
    console.table(user);
    return await this.userService.removeInvitation(user.userUuid, room);
  }

  async getPendingInvitations(userId: string): Promise<Room[]> {
    const user: user = await this.userService.getCompleteUser(userId);
    return user.invitationPending;
  }

  /*
   * dm room functions
   */

  async createDMRoom(sender: user, recipientId: string): Promise<Room> {
    let newDMRoom: Room = this.roomsRepository.create({
      type: RoomType.DM,
    });
    newDMRoom = await this.roomsRepository.save(newDMRoom);
    const recipient: user = await this.userService.getUser(recipientId);
    const recipientMember: Promise<ChatMember> = this.createChatMember(
      recipient,
      newDMRoom,
    );
    const senderMember: Promise<ChatMember> = this.createChatMember(
      sender,
      newDMRoom,
    );
    Promise.all([senderMember, recipientMember]);
    return newDMRoom;
  }

  async getDMRoom(sender: user, recipientId: string): Promise<Room> {
    const members: ChatMember[] = await this.chatMembersRepository.find({
      relations: { room: true, user: true },
      where: {
        room: { type: RoomType.DM },
        user: [{ userUuid: sender.userUuid }, { userUuid: recipientId }],
      },
    });
    for (const member1 of members) {
      for (const member2 of members) {
        if (
          member1.user.userUuid !== member2.user.userUuid &&
          member1.room.id === member2.room.id
        )
          return member1.room;
      }
    }
    return await this.createDMRoom(sender, recipientId);
  }

  // async joinDMRoom(sender: user, recipientId: string): Promise<Room> {
  //   try {
  //     return await this.getDMRoom(sender.userUuid, recipientId);
  //   } catch (error) {
  //     return await this.createDMRoom(sender, recipientId);
  //   }
  // }

  async getOtherDMUser(userId: string, roomId: string): Promise<user> {
    const otherChatMember: ChatMember =
      await this.chatMembersRepository.findOneOrFail({
        relations: { user: true, room: true },
        where: {
          room: { id: roomId },
          user: { userUuid: Not(userId) },
        },
      });
    return otherChatMember.user;
  }

  /*
   * admin functions
   */

  async setAdmin(setAdminDto: SetAdminDto): Promise<ChatMember> {
    console.log('setAdminDto = ', setAdminDto);
    const chatMember: ChatMember = await this.findChatMember(
      setAdminDto.userId,
      setAdminDto.roomId,
    );
    chatMember.isAdmin = setAdminDto.isAdmin;
    return await this.chatMembersRepository.save(chatMember);
  }

  async punishUser(punishUserDto: PunishUserDto): Promise<ChatMember> {
    const chatMember: ChatMember = await this.findChatMember(
      punishUserDto.userId,
      punishUserDto.roomId,
    );
    const endPunishment: Date = new Date(
      Date() + punishUserDto.duration * 1000,
    );
    chatMember.mutedTime = endPunishment;
    if (punishUserDto.isBanned === true) chatMember.bannedTime = endPunishment;
    return await this.chatMembersRepository.save(chatMember);
  }

  async removePunishment(
    removePunishmentDto: RemovePunishmentDto,
  ): Promise<ChatMember> {
    const chatMember: ChatMember = await this.findChatMember(
      removePunishmentDto.userId,
      removePunishmentDto.roomId,
    );
    chatMember.bannedTime = null;
    if (removePunishmentDto.unMute === true) chatMember.mutedTime = null;
    return await this.chatMembersRepository.save(chatMember);
  }

  async amIAdmin(userId: string, roomId: string): Promise<boolean> {
    const chatMember: ChatMember =
      await this.chatMembersRepository.findOneOrFail({
        relations: { room: true, user: true },
        where: { room: { id: roomId }, user: { userUuid: userId } },
        // select: { isAdmin: true },
      });
    if (chatMember.room.type === RoomType.DM) return false;
    return chatMember.isAdmin;
  }

  /*
   * owner functions
   */

  async giveOwnership(giveOwnershipDto: DoubleUuidDto): Promise<Room> {
    const room: Promise<Room> = this.findRoomById(giveOwnershipDto.roomId);
    const chatMember: Promise<ChatMember> = this.findChatMember(
      giveOwnershipDto.userId,
      giveOwnershipDto.roomId,
    );
    (await room).owner = await chatMember;
    (await chatMember).isAdmin = true;
    await this.chatMembersRepository.save(await chatMember);
    return await this.roomsRepository.save(await room);
  }

  async changePassword(changePasswordDto: ChangePasswordDto): Promise<Room> {
    const room: Room = await this.findRoomById(changePasswordDto.roomId);
    if (!changePasswordDto.password) room.type = RoomType.PROTECTED;
    if (!changePasswordDto.newPassword) room.type = RoomType.PUBLIC;
    room.hash = await argon.hash(changePasswordDto.newPassword);
    return await this.roomsRepository.save(room);
  }

  async deleteRoom(roomId: string): Promise<Room> {
    const room: Room = await this.roomsRepository.findOneOrFail({
      where: { id: roomId },
      select: { id: true },
    });
    return await this.roomsRepository.remove(room);
  }

  async amIOwner(userId: string, roomId: string): Promise<boolean> {
    const room: Room = await this.roomsRepository.findOneOrFail({
      relations: { owner: { user: true } },
      select: { owner: { id: true } },
      where: { id: roomId },
    });
    if (room.type === RoomType.DM) return false;
    return room.owner.user.userUuid === userId;
  }

  async findAllUsersInRoom(userId: string, roomId: string): Promise<Room[]> {
    const rooms = await this.roomsRepository
      .createQueryBuilder('room')
      .innerJoin('room.members', 'members')
      .innerJoin('members.user', 'user')
      .where('room.id = :roomId', { roomId: roomId })
      .andWhere('user.userUuid != :userId', { userId: userId })
      .select('user.userUuid', 'userUuid')
      .addSelect('user.userName', 'userName')
      .addSelect('user.userName', 'userName')
      .addSelect('members.bannedTime', 'bannedTime')
      .addSelect('members.mutedTime', 'mutedTime')
      .getRawMany();
    for (const room of rooms) {
      room.bannedTime =
        !room.bannedTime || room.bannedTime > Date() ? false : true;
      room.mutedTime =
        !room.mutedTime || room.mutedTime > Date() ? false : true;
    }
    return rooms;
  }

  // async updatePunishment(roomId: string): Promise<ChatMember> {
  //   const chatMember: ChatMember =
  //     await this.chatMembersRepository.findOneOrFail({
  //       relations: { room: true },
  //       where: { room: { id: roomId } },
  //       select: { bannedTime: true, mutedTime: true },
  //     });
  //   if ()
  // }

  async filterByAdminRightsInRoom(
    filterByAdminRightsDto: FilterByAdminRightsDto,
    userId: string,
  ): Promise<ChatMember[]> {
    return await this.chatMembersRepository.find({
      relations: { room: true, user: true },
      select: {
        user: { userName: true, userUuid: true },
      },
      where: {
        isAdmin: filterByAdminRightsDto.isAdmin,
        room: { id: filterByAdminRightsDto.roomId },
        user: { userUuid: Not(userId) },
      },
    });
  }

  async findBannedUsersInRoom(roomId: string): Promise<ChatMember[]> {
    return await this.chatMembersRepository.find({
      relations: { room: true, user: true },
      select: {
        user: { userName: true, userUuid: true },
      },
      where: {
        bannedTime: Not(IsNull()) && LessThan(new Date()),
        room: { id: roomId },
      },
    });
  }

  async findMutedUsersInRoom(roomId: string): Promise<ChatMember[]> {
    return await this.chatMembersRepository.find({
      relations: { room: true, user: true },
      select: {
        user: { userName: true, userUuid: true },
      },
      where: {
        mutedTime: Not(IsNull()) && LessThan(new Date()),
        room: { id: roomId },
      },
    });
  }

  /*
   * socket functions
   */

  async getUserUuidFromCookies(cookie: string): Promise<string> {
    try {
      const accessToken: string = cookie
        .split('; ')
        .find((cookie: string) => cookie.startsWith('access_token='))
        .split('=')[1];
      const jwtOptions: JwtVerifyOptions = {
        secret: JwtConfig.secret,
      };
      const jwtPayload: TokenPayload = await this.jwtService.verify(
        accessToken,
        jwtOptions,
      );
      return jwtPayload.userUuid;
    } catch (error) {
      throw new WsException('Invalid access token');
    }
  }

  async handleConnection(cookie: string): Promise<ChatMember[]> {
    const userId: string = await this.getUserUuidFromCookies(cookie);
    return await this.chatMembersRepository.find({
      relations: { room: true, user: true },
      select: { room: { id: true } },
      where: { user: { userUuid: userId } },
    });
  }
}
