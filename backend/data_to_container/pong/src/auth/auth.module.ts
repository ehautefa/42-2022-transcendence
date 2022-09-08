import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { FortyTwoStrategy } from './fortyTwo.strategy';

@Module({
  imports: [UserModule, PassportModule, JwtModule.register({ // put this in a config file?
    secret: process.env.JWT_SIGN, // put in env var 
    signOptions: { expiresIn: '60s'},
  })],
  providers: [AuthService, FortyTwoStrategy, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
