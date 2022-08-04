import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { QuestionController } from './question.controller';
import { TestService } from './test.service';
import { QuestionService } from './question.service'
import { BddModule } from 'src/bdd/bdd.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from 'src/bdd/quiz.entity';
import { Question } from 'src/bdd/question.entity';

@Module({
  imports: [BddModule, TypeOrmModule.forFeature([Quiz, Question])],
  controllers: [TestController, QuestionController],
  providers: [TestService, QuestionService]
})
export class TestModule {}

