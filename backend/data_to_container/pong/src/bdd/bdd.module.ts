import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { match } from './matchs.entity';
import { user } from './users.entity';
import { typeOrmConfig } from './config/typeorm.config';
import { Quiz } from './quiz.entity';
import { Question } from './question.entity';

@Module({
    imports: [TypeOrmModule.forRoot(typeOrmConfig),TypeOrmModule.forFeature([user, match, Quiz, Question])],
})
export class BddModule {}
