import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/bdd/message.entity';
import { Room, RoomType } from 'src/bdd/room.entity';
import { user } from 'src/bdd/users.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/createMessage.dto';
import { CreateRoomDto } from './dto/createRoom.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
  ) {}

  private readonly userService: UserService;

  /*
   ** service functions called by the gateway
   */

  async createMessage(createMessageDto: CreateMessageDto) {
    try {
      const room = await this.roomsRepository.findOneOrFail({
        where: { id: createMessageDto.roomId },
      });
      const sender = await this.userService.getUser(createMessageDto.senderId);
      const newMessage = this.messagesRepository.create({
        message: createMessageDto.message,
        room: room,
        sender: sender,
        time: Date.now().toString(),
      });
      this.messagesRepository.save(newMessage);
      return newMessage;
    } catch (error) {
      console.error(error);
    }
  }

  async createRoom(createRoomDto: CreateRoomDto): Promise<Room> {
    const owner: user = await this.userService.getUser(createRoomDto.ownerId);
    if (!owner) {
      console.error('User not found');
      return null;
    }
    const newRoom: Room = this.roomsRepository.create({
      name: createRoomDto.name,
      owner: owner,
      isProtected: createRoomDto.isProtected,
      password: createRoomDto.password,
      type: createRoomDto.type,
      users: [owner],
    });
    this.roomsRepository.save(newRoom);
    return newRoom;
  }

  async joinDMRoom(senderId: string, recipientId: string) {
    try {
      const room: Room = await this.getDMRoom(senderId, recipientId);
      return room;
    } catch (err) {
      try {
        const room = await this.createDMRoom(senderId, recipientId);
        return room;
      } catch (error) {
        console.error(error);
      }
    }
  }

  async getDMRoom(senderId: string, recipientId: string): Promise<Room> {
    // SELECT * from rooms
    // LEFT JOIN room_users_user ON rooms.id = room_users_user.room_id
    // LEFT JOIN users ON room_users_user.user_id = users.id
    // WHERE rooms.type = 'dm' AND users.id IN (2, 4)
    // GROUP BY rooms.id
    // HAVING COUNT(users.id) = 2;
    return (
      this.roomsRepository
        .createQueryBuilder('room')
        .leftJoinAndSelect('room.users', 'users')
        // .select('room.id', 'roomId')
        .where('room.type = :type', { type: 'dm' })
        .andWhere('users.id in (:...userId)', {
          userId: [senderId, recipientId],
        })
        .groupBy('room.id')
        .having('count(users.id) = 2')
        .getOne()
    );
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

  async findAllPublicRooms(): Promise<Room[]> {
    const rooms: Room[] = await this.roomsRepository.find({
      where: { type: RoomType.PUBLIC },
    });
    return rooms;
  }

  async getAllMessagesInRoom(roomId: string): Promise<Message[]> {
    try {
      const messages: Message[] = await this.messagesRepository
        .createQueryBuilder('msg')
        .leftJoinAndSelect('msg.room', 'room')
        .where('room.id = :roomId', { roomId })
        .getRawMany();
      return messages;
    } catch (error) {
      throw error;
    }
  }

  async getRoomByName(roomName: string): Promise<Room> {
    try {
      const room: Room = await this.roomsRepository.findOneOrFail({
        where: { name: roomName },
      });
      return room;
    } catch (error) {
      throw error;
    }
  }

  async getRoomById(roomId: string) {
    try {
      const room: Room = await this.roomsRepository.findOneOrFail({
        where: { id: roomId },
      });
      return room;
    } catch (error) {
      throw error;
    }
  }
}
