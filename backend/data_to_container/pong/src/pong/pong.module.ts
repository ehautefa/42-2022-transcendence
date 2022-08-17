import { Module } from '@nestjs/common';
import { PongController } from './pong.controller';

@Module({
  controllers: [PongController]
})
export class PongModule {}
