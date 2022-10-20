import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatMember, Message, Room, RoomType, user } from 'src/bdd/';
import { UserService } from 'src/user/user.service';
import { DeepPartial, Repository } from 'typeorm';
import { CreateMessageDto, CreateRoomDto, UuidDto } from './dto';

@Injectable()
// @UseFilters(ChatExceptionFilter)
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
    @InjectRepository(ChatMember)
    private chatMembersRepository: Repository<ChatMember>,
  ) {}

  private readonly userService: UserService;

  // A logger for debugging purposes
  private logger: Logger = new Logger('ChatService');

  /*
   ** service functions called by the gateway
   */

  async getChatMember(user: user, room: Room): Promise<ChatMember> {
    try {
      const chatMember: ChatMember =
        await this.chatMembersRepository.findOneOrFail({
          relations: {
            user: true,
            room: true,
          },
          where: {
            user: { userUuid: user.userUuid },
            room: { id: room.id },
          },
        });
      return chatMember;
    } catch (error) {
      const chatMember = this.chatMembersRepository.create({
        user: user,
        room: room,
      });
      return this.chatMembersRepository.save(chatMember);
    }
  }

  async createMessage(
    createMessageDto: CreateMessageDto,
    sender: user,
  ): Promise<Message> {
    const room: Room = await this.getRoomById(createMessageDto.roomId);
    const chatMember: ChatMember = await this.getChatMember(sender, room);
    const newMessage = this.messagesRepository.create({
      message: createMessageDto.message,
      room: room,
      sender: chatMember,
      time: Date.now(),
    });
    this.messagesRepository.save(newMessage);
    this.logger.log('createMessage is OK');
    return newMessage;
  }

  async findOtherUserDMRoom(roomDM: Room, user: user): Promise<user> {
    return;
  }

  async createRoom(createRoomDto: CreateRoomDto, owner: user): Promise<Room> {
    const newRoom: Room = this.roomsRepository.create({
      name: createRoomDto.name,
      isProtected: createRoomDto.isProtected,
      password: createRoomDto.password,
      type: createRoomDto.type,
    });
    const chatMember: ChatMember = await this.getChatMember(owner, newRoom);
    newRoom.owner = chatMember;
    newRoom.members.push(chatMember);
    await this.roomsRepository.save(newRoom);
    return newRoom;
  }

  async joinDMRoom(sender: user, recipientId: UuidDto) {
    try {
      return await this.getDMRoom(sender.userUuid, recipientId.uuid);
    } catch (error) {
      return await this.createDMRoom(sender, recipientId.uuid);
    }
  }

  // async getDMRoom(senderId: string, recipientId: string): Promise<Room> {
  // SELECT * from rooms
  // LEFT JOIN room_users_user ON rooms.id = room_users_user.room_id
  // LEFT JOIN users ON room_users_user.user_id = users.id
  // WHERE rooms.type = 'dm' AND users.id IN (2, 4)
  // GROUP BY rooms.id
  // HAVING COUNT(users.id) = 2;
  // const room: Room = await this.roomsRepository
  // .createQueryBuilder('room')
  // .leftJoinAndSelect('room.users', 'users')
  // .select('room.id', 'roomId')
  // .where('room.type = :type', { type: 'dm' })
  // .andWhere('users.id in (:...userId)', {
  // userId: [senderId, recipientId],
  // })
  // .groupBy('room.id')
  // .having('count(users.id) = 2')
  // .getOneOrFail();
  //   const room: Room = await this.roomsRepository
  //     .createQueryBuilder('room')
  //     .leftJoinAndSelect('room.members', 'members')
  //     .leftJoinAndSelect('members.user', 'user')
  //     .where('room.type = :type', { type: RoomType.DM })
  //     .andWhere('user.userUuid = :userUuid', { userUuid: recipientId })
  //     .groupBy('room.id')
  //     .getOneOrFail();

  //   return room;
  // }
  async getDMRoom(senderId: string, recipientId: string) {
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

  async findAllPublicRooms(): Promise<DeepPartial<Room>[]> {
    const rooms: Room[] = await this.roomsRepository.find({
      select: { id: true, name: true },
      where: { type: RoomType.PUBLIC },
    });
    console.log(rooms);
    return rooms;
  }

  async findAllMessagesInRoom({
    uuid: roomId,
  }: {
    uuid: string;
  }): Promise<Message[]> {
    console.log('roomId = ', roomId);
    const messages: Message[] = await this.messagesRepository.find({
      relations: { room: true },
      where: {
        room: { id: roomId },
      },
    });
    return messages;
  }

  async findLastMessageInRoom(roomIdDto: UuidDto): Promise<Message> {
    const messages: Message[] = await this.findAllMessagesInRoom(roomIdDto);
    return messages[messages.length - 1];
  }
  /*
  async addAdmin(newAdmin: user, roomId: string): Promise<Room> {
    const room: Room = await this.getRoomById(roomId);
    room.admin.push(newAdmin);
    this.roomsRepository.save(room);
    return room;
  }

  async deleteRoom(roomId: string, currentUser: user): Promise<Room> {
    const room: Room = await this.getRoomById(roomId);
    if (currentUser !== room.owner)
      throw new Error('A room can only be destroyed by its owner');
    return this.roomsRepository.remove(room);
  }

  async changeOwnership(
    roomId: string,
    oldOwner: user,
    newOwnerId: string,
  ): Promise<Room> {
    const newOwner: user = await this.userService.getUser(newOwnerId);
    if (!newOwner) throw new Error('New owner invalid');
    const room: Room = await this.getRoomById(roomId);
    if (oldOwner !== room.owner)
      throw new Error(
        'Only the current owner can give its room to someone else',
      );
    room.owner = newOwner;
    this.roomsRepository.save(room);
    return room;
  }
*/
  async getRoomByName(roomName: string): Promise<Room> {
    const room: Room = await this.roomsRepository.findOneOrFail({
      where: { name: roomName },
    });
    return room;
  }

  async getRoomById(roomId: string) {
    const room: Room = await this.roomsRepository.findOneOrFail({
      where: { id: roomId },
    });
    return room;
  }
  /*
  async isAdmin(userId: string, roomId: string): Promise<boolean> {
    const room: Room = await this.getRoomById(roomId);
    room.admin.forEach((adm) => {
      if (adm.userUuid === userId) return true;
    });
    return false;
  }

  async isOwner(userId: string, roomId: string): Promise<boolean> {
    const room: Room = await this.getRoomById(roomId);
    return room.owner.userUuid === userId;
  }
  */
}
