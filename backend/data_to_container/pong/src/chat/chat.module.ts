import { Module } from '@nestjs/common';
import { BddModule } from 'src/bdd/bdd.module';
import { UserModule } from 'src/user/user.module';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
  imports: [UserModule, BddModule],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
