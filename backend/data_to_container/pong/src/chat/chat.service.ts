import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { WsException } from '@nestjs/websockets';
import * as argon from 'argon2';
import { JwtConfig } from 'src/auth/config/Jwt.config';
import TokenPayload from 'src/auth/tokenPayload.interface';
import { ChatMember, Message, Room, RoomType, user } from 'src/bdd/';
import { SendAlertDto } from 'src/status/dto/sendAlert.dto';
import { UserService } from 'src/user/user.service';
import { IsNull, MoreThan, Not, Repository } from 'typeorm';
import { DateUtils } from 'typeorm/util/DateUtils';
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
    // this.logger.debug('createMessage is OK');
    // this.logger.debug(chatMember);
    return await this.messagesRepository.save(newMessage);
  }

  async findAllMessagesInRoom({
    uuid: roomId,
  }: {
    uuid: string;
  }): Promise<any[]> {
    const messages: Message[] = await this.messagesRepository
      .createQueryBuilder('msg')
      .innerJoin('msg.sender', 'sender')
      .innerJoin('sender.room', 'room')
      .innerJoin('sender.user', 'user')
      .where('room.id = :id', { id: roomId })
      .select('message')
      .addSelect('user.userName', 'userName')
      .addSelect('msg.id', 'id')
      .addSelect('msg.time', 'time')
      .orderBy('msg.time')
      .getRawMany();
    return messages;
  }

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

    if (chatMember.room.type === RoomType.DM)
      throw new WsException('You cannot leave a Direct Message');
    if (chatMember.room.owner.user.userUuid === chatMember.user.userUuid)
      throw new WsException('You cannot leave a room you own');
    if (
      chatMember.bannedTime !== null &&
      (chatMember.bannedTime as Date).getTime() > new Date().getTime()
    )
      throw new WsException('You cannot leave a room you are banned from');
    if (
      chatMember.mutedTime !== null &&
      (chatMember.mutedTime as Date).getTime() > new Date().getTime()
    )
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
        mbr.bannedTime !== null &&
        (mbr.bannedTime as Date).getTime() > new Date().getTime()
          ? true
          : false;
      mbr.mutedTime =
        mbr.mutedTime !== null &&
        (mbr.mutedTime as Date).getTime() > new Date().getTime()
          ? true
          : false;
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
    const recipient: user = await this.userService.getUser(recipientId);
    let newDMRoom: Room = this.roomsRepository.create({
      name: recipient.userName + sender.userName,
      type: RoomType.DM,
    });
    newDMRoom = await this.roomsRepository.save(newDMRoom);
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

  async getOtherDMUser(userId: string, roomId: string): Promise<user> {
    const otherChatMember: ChatMember =
      await this.chatMembersRepository.findOneOrFail({
        relations: {
          user: { blocked: true },
          room: true,
        },
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
    const chatMember: ChatMember = await this.findChatMember(
      setAdminDto.userId,
      setAdminDto.roomId,
    );
    if (
      (await this.amIOwner(setAdminDto.userId, setAdminDto.roomId)) === false
    ) {
      chatMember.isAdmin = setAdminDto.isAdmin;
      var param: SendAlertDto = {
        userUuid: setAdminDto.userId,
        message: setAdminDto.isAdmin
          ? 'You are now an admin of ' + chatMember.room.name
          : 'You are no longer an admin of ' + chatMember.room.name,
      };
      this.eventEmitter.emit('alert.send', param);
      return await this.chatMembersRepository.save(chatMember);
    }
  }

  async punishUser(punishUserDto: PunishUserDto): Promise<ChatMember> {
    const chatMember: ChatMember = await this.findChatMember(
      punishUserDto.userId,
      punishUserDto.roomId,
    );
    const endPunishment: Date = new Date();
    endPunishment.setTime(
      endPunishment.getTime() + punishUserDto.duration * 1000,
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
        room.bannedTime !== null &&
        (room.bannedTime as Date).getTime() > new Date().getTime()
          ? true
          : false;
      room.mutedTime =
        room.mutedTime !== null &&
        (room.mutedTime as Date).getTime() > new Date().getTime()
          ? true
          : false;
    }
    return rooms;
  }

  async filterByAdminRightsInRoom(
    filterByAdminRightsDto: FilterByAdminRightsDto,
    userId: string,
  ): Promise<ChatMember[]> {
    // TO DO : remove owner from the list
    const chatMembers: ChatMember[] = await this.chatMembersRepository.find({
      relations: { room: { owner: { user: true } }, user: true },
      select: {
        user: { userName: true, userUuid: true },
      },
      where: {
        room: {
          id: filterByAdminRightsDto.roomId,
        },
        isAdmin: filterByAdminRightsDto.isAdmin,
        user: { userUuid: Not(userId) },
      },
    });

    chatMembers.forEach((member) => {
      if (member.room.owner.user.userUuid == member.user.userUuid)
        chatMembers.splice(chatMembers.indexOf(member));
    });
    // const user: user {userName }
    this.logger.debug('FILTER BY ADMIN RIGHTS');
    console.log(chatMembers);
    return chatMembers;
  }

  async findBannedUsersInRoom(roomId: string): Promise<ChatMember[]> {
    return await this.chatMembersRepository.find({
      relations: { room: true, user: true },
      select: {
        user: { userName: true, userUuid: true },
      },
      where: {
        bannedTime:
          Not(IsNull()) &&
          MoreThan(DateUtils.mixedDateToUtcDatetimeString(new Date())),
        room: { id: roomId },
      },
    });
  }

  async findMutableUsersInRoom(
    userId: string,
    roomId: string,
  ): Promise<user[]> {
    const chatMembers: ChatMember[] = await this.chatMembersRepository.find({
      relations: { user: true, room: true },
      where: {
        room: { id: roomId },
        isAdmin: false,
      },
    });
    chatMembers.forEach((member) => {
      if (
        member.mutedTime !== null &&
        (member.mutedTime as Date).getTime() < new Date().getTime()
      ) {
        member.mutedTime = null;
        this.roomsRepository.save(member);
      } else if (member.mutedTime !== null)
        chatMembers.splice(chatMembers.indexOf(member));
    });
    return chatMembers.map((member) => member.user);
  }

  async findBannableUsersInRoom(
    userId: string,
    roomId: string,
  ): Promise<user[]> {
    const chatMembers: ChatMember[] = await this.chatMembersRepository.find({
      relations: { user: true, room: true },
      where: {
        room: { id: roomId },
        isAdmin: false,
      },
    });
    chatMembers.forEach((member) => {
      if (
        member.bannedTime !== null &&
        (member.bannedTime as Date).getTime() < new Date().getTime()
      ) {
        member.bannedTime = null;
        this.chatMembersRepository.save(member);
      } 
      else if (member.bannedTime !== null)
        chatMembers.splice(chatMembers.indexOf(member));
    });
    // this.logger.debug('BannableUsers');
    // console.log(chatMembers.map((member) => member.user));
    return chatMembers.map((member) => member.user);
  }

  async findMutedUsersInRoom(roomId: string): Promise<ChatMember[]> {
    return await this.chatMembersRepository.find({
      relations: { room: true, user: true },
      select: {
        user: { userName: true, userUuid: true },
      },
      where: {
        mutedTime:
          Not(IsNull()) &&
          MoreThan(DateUtils.mixedDateToUtcDatetimeString(new Date())),
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
