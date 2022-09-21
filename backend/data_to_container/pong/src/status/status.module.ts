import { Module } from '@nestjs/common';
import { StatusGateway } from './status.gateway';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({ // put this in a config file?
    secret: process.env.JWT_SIGN,
    signOptions: { expiresIn: '60000s'},
  })],
  providers: [ StatusGateway],
  exports: [StatusGateway],
})
export class StatusModule {}
