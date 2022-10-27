import { Module } from '@nestjs/common';
import { MatchModule } from 'src/match/match.module';
import { StatusModule } from 'src/status/status.module';
import { PongGateway } from './pong.gateway';
import { PongService } from './pong.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    MatchModule,
    StatusModule,
    ScheduleModule.forRoot(),
],
  exports: [PongService],
  providers: [PongGateway, PongService],
})
export class PongModule {}
