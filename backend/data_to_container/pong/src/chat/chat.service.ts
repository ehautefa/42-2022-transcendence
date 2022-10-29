import { Injectable, Logger } from '@nestjs/common';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { WsException } from '@nestjs/websockets';
import * as argon from 'argon2';
import { JwtConfig } from 'src/auth/config/Jwt.config';
import TokenPayload from 'src/auth/tokenPayload.interface';
import { ChatMember, Message, Room, RoomType, user } from 'src/bdd/';
import { UserService } from 'src/user/user.service';
import { DeepPartial, IsNull, LessThan, Not, Repository } from 'typeorm';
import { CreateMessageDto, CreateRoomDto, UuidDto } from './dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { FilterByAdminRightsDto } from './dto/filter-by-admin-rights.dto';
import { GiveOwnershipDto } from './dto/give-ownership.dto';
import { PunishUserDto } from './dto/punish-user.dto';
import { RemovePunishmentDto } from './dto/remove-punishment.dto';
import { SetAdminDto } from './dto/set-admin.dto';
import { StringDto } from './dto/string.dto';

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
    console.log('roomId = ', roomId);
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

  async findLastMessageInRoom(roomIdDto: UuidDto): Promise<Message> {
    const messages: Message[] = await this.findAllMessagesInRoom(roomIdDto);
    return messages[messages.length - 1];
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
      isProtected: createRoomDto.isProtected,
      hash: hash,
      type: createRoomDto.type,
    });
    newRoom = await this.roomsRepository.save(newRoom);
    const chatMember: ChatMember = await this.createChatMember(owner, newRoom);
    newRoom.owner = chatMember;
    console.log(newRoom);
    return await this.roomsRepository.save(newRoom);
  }

  async findAllPublicRooms(): Promise<DeepPartial<Room>[]> {
    const rooms: Room[] = await this.roomsRepository.find({
      select: { id: true, name: true },
      where: { type: RoomType.PUBLIC },
    });
    return rooms;
  }

  async findRoomById(roomId: string): Promise<Room> {
    const room: Room = await this.roomsRepository.findOneOrFail({
      where: { id: roomId },
    });
    return room;
  }

  async joinPrivateRoom(joinPrivateRoomDto: StringDto): Promise<Room> {
    try {
      return await this.findRoomByName(joinPrivateRoomDto.str);
    } catch (error) {
      throw new WsException(`Room ${joinPrivateRoomDto.str} does not exist.`);
    }
  }

  async findRoomByName(roomName: string): Promise<Room> {
    return await this.roomsRepository.findOneOrFail({
      where: { name: roomName },
    });
  }

  async findAllInvitableUsers(roomId: string): Promise<user[]> {
    const users: user[] = await this.userService.getAllUser();
    const chatMembers: ChatMember[] = await this.chatMembersRepository.find({
      relations: {
        user: true,
        room: true,
      },
      select: {
        user: { userUuid: true },
      },
      where: {
        room: { id: roomId },
      },
    });
    for (const member of chatMembers) {
      for (const index in users) {
        if (member.user.userUuid === users[index].userUuid)
          users.splice(+index);
      }
    }
    return users;
  }

  /*
   * dm room functions
   */

  async createDMRoom(sender: user, recipientId: string): Promise<Room> {
    const newDMRoom: Room = this.roomsRepository.create({
      type: RoomType.DM,
    });
    const recipient: user = await this.userService.getUser(recipientId);
    const recipientMember: Promise<ChatMember> = this.getChatMember(
      recipient,
      newDMRoom,
    );
    const senderMember: Promise<ChatMember> = this.getChatMember(
      sender,
      newDMRoom,
    );
    newDMRoom.members.push(await senderMember, await recipientMember);
    this.roomsRepository.save(newDMRoom);
    return newDMRoom;
  }

  async getDMRoom(senderId: string, recipientId: string): Promise<Room> {
    const room: Room = await this.roomsRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.members', 'members')
      .leftJoinAndSelect('members.user', 'user')
      .where('room.type = :type', { type: 'dm' })
      .andWhere('user.id in (:...userId)', {
        userId: [senderId, recipientId],
      })
      .groupBy('room.id')
      .having('count(users.id) = 2')
      .getOneOrFail();
    return room;
  }

  async joinDMRoom(sender: user, recipientId: UuidDto): Promise<Room> {
    try {
      return await this.getDMRoom(sender.userUuid, recipientId.uuid);
    } catch (error) {
      return await this.createDMRoom(sender, recipientId.uuid);
    }
  }

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
    const chatMember: ChatMember = await this.findChatMember(
      setAdminDto.userId,
      setAdminDto.roomId,
    );
    chatMember.isAdmin = setAdminDto.isAdmin;
    this.roomsRepository.save(chatMember);
    return chatMember;
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
    delete chatMember.bannedTime;
    if (removePunishmentDto.unMute === true) delete chatMember.mutedTime;
    return await this.chatMembersRepository.save(chatMember);
  }

  // async filterUsersInRoom(
  //   filterUsersDto: FilterUsersDto,
  // ): Promise<ChatMember[]> {
  //   let timeNow: Date;
  //   if (filterUsersDto.banned || filterUsersDto.muted) timeNow = new Date();
  //   return await this.chatMembersRepository.find({
  //     relations: { user: true, room: true },
  //     select: {
  //       user: { userName: true, userUuid: true },
  //     },
  //     where: {
  //       room: { id: filterUsersDto.roomId },
  //       isAdmin: filterUsersDto.admin,
  //       bannedTime: filterUsersDto.banned && Not(IsNull) && LessThan(timeNow),
  //       mutedTime: filterUsersDto.muted && Not(IsNull) && LessThan(timeNow),
  //     },
  //   });
  // }

  /*
   * owner functions
   */

  async giveOwnership(giveOwnershipDto: GiveOwnershipDto): Promise<Room> {
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
    room.hash = await argon.hash(changePasswordDto.newPassword);
    return await this.roomsRepository.save(room);
  }

  async deleteRoom(roomId: UuidDto): Promise<Room> {
    const room: Room = await this.findRoomById(roomId.uuid);
    return await this.roomsRepository.remove(room);
  }

  // async findAllRoomsToJoin(userId: string): Promise<ChatMember[]> {
  //   const chatMembers: ChatMember[] = await this.chatMembersRepository.find({
  //     relations: { room: true, user: true },
  //     select: { room: { id: true } },
  //     where: { user: { userUuid: userId } },
  //   });
  //   this.logger.debug('Getting all rooms to join');
  //   console.log(chatMembers);
  //   return chatMembers;
  // }

  async filterByAdminRightsInRoom(
    filterByAdminRightsDto: FilterByAdminRightsDto,
  ): Promise<ChatMember[]> {
    return await this.chatMembersRepository.find({
      relations: { room: true, user: true },
      select: {
        user: { userName: true, userUuid: true },
      },
      where: {
        isAdmin: filterByAdminRightsDto.isAdmin,
        room: { id: filterByAdminRightsDto.roomId },
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

  async getUserUuidFromCookies(cookiesStr: string): Promise<string> {
    const cookies: string[] = cookiesStr.split('; ');
    const authCookie: string = cookies.filter((s) =>
      s.includes('access_token='),
    )[0];
    const accessToken = authCookie.substring(
      'access_token'.length + 1,
      authCookie.length,
    );
    const jwtOptions: JwtVerifyOptions = {
      secret: JwtConfig.secret,
    };
    const jwtPayload: TokenPayload = await this.jwtService.verify(
      accessToken,
      jwtOptions,
    );
    return jwtPayload.userUuid;
  }

  async handleConnection(cookiesStr: string): Promise<ChatMember[]> {
    const userId: string = await this.getUserUuidFromCookies(cookiesStr);
    return await this.chatMembersRepository.find({
      relations: {
        room: true,
        user: true,
      },
      select: {
        room: { id: true },
      },
      where: {
        user: { userUuid: userId },
      },
    });
  }
}
