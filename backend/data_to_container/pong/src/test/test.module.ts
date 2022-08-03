import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { QuestionController } from './question.controller';
import { TestService } from './test.service';
import { QuestionService } from './question.service'
import { BddModule } from 'src/bdd/bdd.module';

@Module({
  imports: [BddModule],
  controllers: [TestController, QuestionController],
  providers: [TestService, QuestionService]
})
export class TestModule {}

