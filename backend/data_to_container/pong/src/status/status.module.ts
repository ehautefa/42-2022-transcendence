import { Module } from '@nestjs/common';
import { StatusGateway } from './status.gateway';
import { BddModule } from 'src/bdd/bdd.module';
import { StatusService } from './status.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfig } from 'src/auth/config/Jwt.config';

@Module({
  imports: [BddModule,  JwtModule.register(JwtConfig)],
  providers: [ StatusGateway, StatusService],
  exports: [StatusGateway],
})
export class StatusModule {}
