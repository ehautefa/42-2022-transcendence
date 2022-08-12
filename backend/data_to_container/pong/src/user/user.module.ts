import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BddModule } from 'src/bdd/bdd.module';
import { user } from 'src/bdd/users.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [BddModule],
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
