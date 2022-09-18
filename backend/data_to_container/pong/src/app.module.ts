import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmConfig } from './bdd/config/typeorm.config';
import { TestModule } from './test/test.module';
import { ApiModule } from './api/api.module';
import { BddModule } from './bdd/bdd.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MatchModule } from './match/match.module';
import { PongModule } from './pong/pong.module';
// import { PongGateway } from './pong/pong.gateway';
import { StatusModule } from './status/status.module';
import { StatusGateway } from './status/status.gateway';

@Module({
  imports: [TestModule, ApiModule, BddModule, UserModule, AuthModule, MatchModule, PongModule, StatusModule],
  controllers: [AppController],
  providers: [AppService, StatusGateway],
})
export class AppModule {} 