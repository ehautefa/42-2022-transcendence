import { Module } from '@nestjs/common';
import { StatusGateway } from './status.gateway';
import { BddModule } from 'src/bdd/bdd.module';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [BddModule],
  providers: [ StatusGateway, UserService],
  exports: [StatusGateway],
})
export class StatusModule {}
