import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  // sendMessage(messagetDto: MessageDto, client: Socket) {
  //   client;
  //   return messagetDto;
  // }

  findAll() {
    return `This action returns all chat`;
  }

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
