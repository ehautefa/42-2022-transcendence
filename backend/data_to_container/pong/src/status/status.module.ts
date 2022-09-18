import { Module } from '@nestjs/common';
import { StatusService } from './status.service';

@Module({
  providers: [StatusService]
})
export class StatusModule {}
