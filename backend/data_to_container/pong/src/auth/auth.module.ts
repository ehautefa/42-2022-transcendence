import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { FortyTwoStrategy } from './strategies/fortyTwo.strategy';

@Module({
  imports: [UserModule, PassportModule, JwtModule.register({ // put this in a config file?
    secret: process.env.JWT_SIGN,
    signOptions: { expiresIn: '60000s'},
  }),], 
  providers: [AuthService, FortyTwoStrategy, JwtStrategy, ],
  controllers: [AuthController],
  exports: [JwtStrategy, FortyTwoStrategy]
})
export class AuthModule {}
