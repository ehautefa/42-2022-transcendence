import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { FortyTwoStrategy } from './strategies/fortyTwo.strategy';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';
import { JwtConfig } from './config/Jwt.config';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register(JwtConfig),
  ],
  providers: [AuthService, FortyTwoStrategy, JwtStrategy,],
  controllers: [AuthController],
  exports: [JwtStrategy, FortyTwoStrategy]
})
export class AuthModule { }
