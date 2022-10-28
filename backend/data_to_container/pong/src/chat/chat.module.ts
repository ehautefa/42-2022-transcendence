import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfig } from 'src/auth/config/Jwt.config';
import { BddModule } from 'src/bdd/bdd.module';
import { UserModule } from 'src/user/user.module';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
  imports: [UserModule, BddModule, JwtModule.register(JwtConfig)],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
