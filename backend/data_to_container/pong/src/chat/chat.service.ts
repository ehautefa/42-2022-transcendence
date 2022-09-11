import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/bdd/message.entity';
import { Room } from 'src/bdd/room.entity';
import { user } from 'src/bdd/users.entity';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/createMessage.dto';
import { createRoomDto } from './dto/createRoom.dto';

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
          // for now the research is done by name but it may
          // be better to do it by uuid ... idk ¯\_(ツ)_/¯
          id: createMessageDto.room,
        },
      });
      const sender = await this.usersRepository.findOneOrFail({
        where: {
          userUuid: createMessageDto.name, // same thing here
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

  createRoom(createRoomDto: createRoomDto) {
    if (createRoomDto.type === 'private') create;
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
