import { Module } from '@nestjs/common';
import { MatchModule } from 'src/match/match.module';
import { PongGateway } from './pong.gateway';
import { PongService } from './pong.service';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD } from '@nestjs/core';
import { StatusGateway } from 'src/status/status.gateway';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [MatchModule, ScheduleModule.forRoot(), JwtModule.register({ // put this in a config file?
    secret: process.env.JWT_SIGN,
    signOptions: { expiresIn: '600s'},
  })],
  exports: [PongService],
  providers: [PongGateway, PongService, StatusGateway],
})
export class PongModule {}
