import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { FortyTwoStrategy } from 'src/auth/strategies/fortyTwo.strategy';
import { BddModule } from 'src/bdd/bdd.module';
import { StatusModule } from 'src/status/status.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    ConfigModule,
    BddModule,
    PassportModule,
    StatusModule,
  ],
  controllers: [UserController],
  providers: [UserService, FortyTwoStrategy],
  exports: [UserService]
})
export class UserModule {}
