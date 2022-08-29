import { Module } from '@nestjs/common';
import { MatchModule } from 'src/match/match.module';
import { PongController } from './pong.controller';
import { PongGateway } from './pong.gateway';
import { PongService } from './pong.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [MatchModule, ScheduleModule.forRoot()],
  exports: [PongService],
  controllers: [PongController],
  providers: [PongGateway, PongService]
})
export class PongModule {}
