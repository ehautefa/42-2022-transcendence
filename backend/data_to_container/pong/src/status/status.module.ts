import { Module } from '@nestjs/common';
import { StatusGateway } from './status.gateway';
import { JwtModule } from '@nestjs/jwt';
import { BddModule } from 'src/bdd/bdd.module';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [BddModule, JwtModule.register({ // put this in a config file?
    secret: process.env.JWT_SIGN,
    signOptions: { expiresIn: '60000s'},
  })],
  providers: [ StatusGateway, UserService],
  exports: [StatusGateway],
})
export class StatusModule {}
