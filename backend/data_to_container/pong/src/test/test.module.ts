import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from './quiz.entity';
import { TestController } from './test.controller';
import { QuestionController } from './question.controller';
import { TestService } from './test.service';
import { QuestionService } from './question.service'
import { Question } from './question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Quiz, Question])],
  controllers: [TestController, QuestionController],
  providers: [TestService, QuestionService]
})
export class TestModule {}

