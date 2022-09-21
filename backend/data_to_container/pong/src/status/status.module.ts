import { Module } from '@nestjs/common';
import { StatusGateway } from './status.gateway';

@Module({
  providers: [ StatusGateway],
  exports: [StatusGateway],
})
export class StatusModule {}
