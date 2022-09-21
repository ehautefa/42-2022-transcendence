import { Module } from '@nestjs/common';
import { BddModule } from 'src/bdd/bdd.module';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
  providers: [ChatGateway, ChatService],
  imports: [BddModule],
})
export class ChatModule {}
