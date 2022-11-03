import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtSecretRequestType, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { FortyTwoStrategy } from './strategies/fortyTwo.strategy';
import { ConfigModule } from '@nestjs/config';
import { JwtConfig } from './config/Jwt.config';
import { TwoFAStrategy } from './strategies/2fa.strategy';

@Module({
  imports: [
    ConfigModule,
    UserModule,
    PassportModule,
    JwtModule.register(JwtConfig),
  ],
  providers: [AuthService, FortyTwoStrategy, JwtStrategy, TwoFAStrategy],
  controllers: [AuthController],
})
export class AuthModule { }
