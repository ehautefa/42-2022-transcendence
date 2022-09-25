import { Module } from '@nestjs/common';
import { BddModule } from 'src/bdd/bdd.module';
import { UserModule } from 'src/user/user.module';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [BddModule, UserModule, JwtModule.register({ // put this in a config file?
    secret: process.env.JWT_SIGN,
    signOptions: { expiresIn: '60000s' },
  })],
  controllers: [MatchController],
  providers: [MatchService],
  exports: [MatchService]
})
export class MatchModule {}
