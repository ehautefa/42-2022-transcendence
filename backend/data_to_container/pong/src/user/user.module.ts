import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { FortyTwoStrategy } from 'src/auth/strategies/fortyTwo.strategy';
import { BddModule } from 'src/bdd/bdd.module';
import { StatusModule } from 'src/status/status.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [BddModule,PassportModule, StatusModule, JwtModule.register({ // put this in a config file?
    secret: process.env.JWT_SIGN,
    signOptions: { expiresIn: '60000s' },
  }),],
  controllers: [UserController],
  providers: [UserService, FortyTwoStrategy],
  exports: [UserService]
})
export class UserModule {}
