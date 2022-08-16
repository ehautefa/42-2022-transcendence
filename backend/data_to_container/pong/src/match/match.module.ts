import { Module } from '@nestjs/common';
import { BddModule } from 'src/bdd/bdd.module';
import { UserModule } from 'src/user/user.module';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';

@Module({
  imports: [BddModule, UserModule],
  controllers: [MatchController],
  providers: [MatchService],
  exports: [MatchService]
})
export class MatchModule {}
