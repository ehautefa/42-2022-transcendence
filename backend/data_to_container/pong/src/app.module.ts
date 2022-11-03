import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiModule } from './api/api.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BddModule } from './bdd/bdd.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MatchModule } from './match/match.module';
import { PongModule } from './pong/pong.module';
import { ChatModule } from './chat/chat.module';
import { StatusModule } from './status/status.module';
import { ConfigModule } from '@nestjs/config';
import { Config } from './config/config';

@Module({
  imports: [
    ApiModule, 
    ChatModule,
    BddModule,
    UserModule,
    AuthModule,
    MatchModule,
    PongModule, 
    StatusModule,
    ConfigModule.forRoot(Config),
    EventEmitterModule.forRoot()
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    // JwtService,
  ],
})
export class AppModule {} 