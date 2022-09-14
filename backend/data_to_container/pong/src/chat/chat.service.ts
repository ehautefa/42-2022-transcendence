import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/bdd/message.entity';
import { Room, RoomType } from 'src/bdd/room.entity';
import { user } from 'src/bdd/users.entity';
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
    @InjectRepository(user)
    private usersRepository: Repository<user>,
  ) {}

  async createMessage(createMessageDto: CreateMessageDto) {
    try {
      const room = await this.roomsRepository.findOneOrFail({
        where: {
          id: createMessageDto.roomId,
        },
      });
      const sender = await this.usersRepository.findOneOrFail({
        where: {
          userUuid: createMessageDto.senderId,
        },
      });
      const newMessage = this.messagesRepository.create({
        message: createMessageDto.message,
        room: room,
        sender: sender,
        time: Date.now().toString(),
      });
      this.messagesRepository.save(newMessage);
      return newMessage;
    } catch (error) {
      throw error;
    }
  }

  async findAllMessagesInRoom(roomId: string): Promise<Message[]> {
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

  async getRoomById(roomId: string) {
    try {
      const room: Room = await this.roomsRepository.findOneOrFail({
        where: {
          id: roomId,
        },
      });
      return room;
    } catch (error) {
      throw error;
    }
  }

  async getDMRoom(senderId: string, recipientId: string): Promise<Room> {
    try {
      const room = await this.roomsRepository
        .createQueryBuilder('room')
        .leftJoinAndSelect('room.users', 'user')
        // .where('users[0].id = :roomId', { roomId })
        .andWhere({ type: RoomType.DM })
        .getOneOrFail();
      return room;
    } catch (error) {
      throw error;
    }
  }

  async createRoom(createRoomDto: CreateRoomDto): Promise<Room> {
    try {
      const owner: user = await this.usersRepository.findOneOrFail({
        where: {
          userUuid: createRoomDto.ownerId,
        },
      });
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
    } catch (error) {
      throw error;
    }
  }

  async createDMRoom(senderId: string, recipientId: string) {
    try {
      const sender = await this.usersRepository.findOneOrFail({
        where: { userUuid: senderId },
      });
      const recipient = await this.usersRepository.findOneOrFail({
        where: { userUuid: recipientId },
      });
      const newRoom = this.roomsRepository.create({
        type: RoomType.DM,
        users: [sender, recipient],
      });
      this.roomsRepository.save(newRoom);
      return newRoom;
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

  async findAllPublicRooms(): Promise<Room[]> {
    const rooms: Room[] = await this.roomsRepository.find({
      where: {
        type: RoomType.PUBLIC,
      },
    });
    return rooms;
  }
}
