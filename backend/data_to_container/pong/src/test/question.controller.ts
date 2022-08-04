
import { Body, Controller, Post, UsePipes, ValidationPipe, } from '@nestjs/common'
import { QuestionDto } from './dto/question.dto'
import { Question } from '../bdd/question.entity';
import { QuestionService } from './question.service'
import { TestService } from './test.service';

@Controller('question')
export class QuestionController {
    constructor(private qs: QuestionService, private ts : TestService ) { }

    @Post('')
    @UsePipes(ValidationPipe)
    async postQuestion(@Body() question : QuestionDto) : Promise<Question >{
        const quiz = await this.ts.getQuizByUd(question.quizId)
        return this.qs.postQuestion(question, quiz);
    }
}
