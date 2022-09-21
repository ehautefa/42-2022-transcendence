import { Module } from '@nestjs/common';
import { MatchModule } from 'src/match/match.module';
import { PongGateway } from './pong.gateway';
import { PongService } from './pong.service';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [MatchModule, ScheduleModule.forRoot(), JwtModule.register({ // put this in a config file?
    secret: process.env.JWT_SIGN,
    signOptions: { expiresIn: '600s'},
  })],
  exports: [PongService],
  providers: [PongGateway, PongService],
})
export class PongModule {}
