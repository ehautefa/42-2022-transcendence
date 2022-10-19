import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WsException } from '@nestjs/websockets';
import { Message } from 'src/bdd/message.entity';
import { Room, RoomType } from 'src/bdd/room.entity';
import { user } from 'src/bdd/users.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateMessageDto, CreateRoomDto } from './dto';

@Injectable()
// @UseFilters(ChatExceptionFilter)
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
  ) {}

  private readonly userService: UserService;

  // A logger for debugging purposes
  private logger: Logger = new Logger('ChatService');

  /*
   ** service functions called by the gateway
   */

  async createMessage(createMessageDto: CreateMessageDto, sender: user) {
    const room = await this.roomsRepository.findOneOrFail({
      where: { id: createMessageDto.roomId },
    });
    if (room.type === RoomType.DM) {
      const recipient: user =
        room.users[0] === sender ? room.users[1] : room.users[0];
      if (this.userService.isBlocked(sender, recipient) === true)
        throw new WsException(
          'Can not send message: you have been blocked by the user.',
        );
    } else {
    }
    const newMessage = this.messagesRepository.create({
      message: createMessageDto.message,
      room: room,
      sender: sender,
      time: new Date(),
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
      owner: owner,
      isProtected: createRoomDto.isProtected,
      password: createRoomDto.password,
      type: createRoomDto.type,
      users: [owner],
    });
    await this.roomsRepository.save(newRoom);
    return newRoom;
  }

  async joinDMRoom(senderId: string, recipientId: string) {
    let room: Room = await this.getDMRoom(senderId, recipientId);
    if (!room) room = await this.createDMRoom(senderId, recipientId);
    return room;
  }

  async getDMRoom(senderId: string, recipientId: string): Promise<Room> {
    // SELECT * from rooms
    // LEFT JOIN room_users_user ON rooms.id = room_users_user.room_id
    // LEFT JOIN users ON room_users_user.user_id = users.id
    // WHERE rooms.type = 'dm' AND users.id IN (2, 4)
    // GROUP BY rooms.id
    // HAVING COUNT(users.id) = 2;
    const room: Room = await this.roomsRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.users', 'users')
      // .select('room.id', 'roomId')
      .where('room.type = :type', { type: 'dm' })
      .andWhere('users.id in (:...userId)', {
        userId: [senderId, recipientId],
      })
      .groupBy('room.id')
      .having('count(users.id) = 2')
      .getOneOrFail();
    return room;
  }

  async createDMRoom(senderId: string, recipientId: string): Promise<Room> {
    const sender: user = await this.userService.getUser(senderId);
    const recipient: user = await this.userService.getUser(recipientId);
    if (!sender || !recipient) return null;
    const newDMRoom: Room = this.roomsRepository.create({
      type: RoomType.DM,
      users: [sender, recipient],
    });
    return newDMRoom;
  }

  async findAllPublicRooms(): Promise<DeepPartial<Room>[]> {
    const rooms: Room[] = await this.roomsRepository.find({
      where: { type: RoomType.PUBLIC },
    });
    return rooms.map((room) => ({ name: room.name, id: room.id }));
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
}
