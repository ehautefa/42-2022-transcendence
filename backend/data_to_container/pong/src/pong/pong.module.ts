import { Module } from '@nestjs/common';
import { MatchModule } from 'src/match/match.module';
import { PongController } from './pong.controller';
import { PongGateway } from './pong.gateway';

@Module({
  imports: [MatchModule],
  controllers: [PongController],
  providers: [PongGateway]
})
export class PongModule {}
