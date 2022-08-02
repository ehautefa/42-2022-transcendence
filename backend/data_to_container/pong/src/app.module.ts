import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmConfig } from './config/typeorm.config';
import { TestModule } from './test/test.module';
import { ApiModule } from './api/api.module';

@Module({
  imports: [TestModule, TypeOrmModule.forRoot(typeOrmConfig), ApiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}