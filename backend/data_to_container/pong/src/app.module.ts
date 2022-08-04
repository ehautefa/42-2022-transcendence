import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmConfig } from './bdd/config/typeorm.config';
import { TestModule } from './test/test.module';
import { PongGateway } from './app.gateway';
import { ApiModule } from './api/api.module';
import { BddModule } from './bdd/bdd.module';

@Module({
  imports: [TestModule, ApiModule, BddModule],
  controllers: [AppController],
  providers: [AppService, PongGateway],
})
export class AppModule {} 