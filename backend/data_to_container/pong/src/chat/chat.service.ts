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

  getDMRoom(senderId: string, recipientId: string): Room | any {
    try {
      const room = this.roomsRepository
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

  createRoom(createRoomDto: CreateRoomDto) {
    // if (createRoomDto.type === 'dm') this.createDMRoom(createRoomDto);
  }

  createDMRoom(senderId: string, recipientId: string) {
    // get sender and recipient
    const room = this.roomsRepository.create({
      type: RoomType.DM,
      // users: [createRoomDto.]
    });
    return room;
  }
  // async findAllMessageInRoom(room: string) {
  // const messages = await this.messagesRepository.find(room);
  // return messages;
  // }

  /*
  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
  */
}
