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
import { ChatModule } from './chat/chat.module';
import { StatusModule } from './status/status.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';

@Module({
  imports: [TestModule, ApiModule, ChatModule, BddModule, UserModule, AuthModule, MatchModule, PongModule, StatusModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        PGPORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        FT_CLIENT_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        REACT_APP_FRONT_URL: Joi.string().required(),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {} 