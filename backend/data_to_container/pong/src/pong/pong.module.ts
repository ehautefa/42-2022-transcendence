import { Module } from '@nestjs/common';
import { MatchModule } from 'src/match/match.module';
import { PongGateway } from './pong.gateway';
import { PongService } from './pong.service';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './pong.guards';
import { StatusGateway } from 'src/status/status.gateway';

@Module({
  imports: [MatchModule, ScheduleModule.forRoot()],
  exports: [PongService],
  providers: [PongGateway, PongService, StatusGateway, { provide: APP_GUARD, useClass: AuthGuard }],
})
export class PongModule {}
