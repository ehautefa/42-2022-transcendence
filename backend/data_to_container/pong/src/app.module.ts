import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmConfig } from './bdd/config/typeorm.config';
import { TestModule } from './test/test.module';
import { PongGateway } from './app.gateway';
import { ApiModule } from './api/api.module';
import { BddModule } from './bdd/bdd.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { GameController } from './game/game.controller';
import { GameModule } from './game/game.module';
import { MatchModule } from './match/match.module';

@Module({
  imports: [TestModule, ApiModule, BddModule, UserModule, AuthModule, GameModule, MatchModule],
  controllers: [AppController, GameController],
  providers: [AppService, PongGateway],
})
export class AppModule {} 