
import { Body, Controller, Post, UsePipes, ValidationPipe, } from '@nestjs/common'
import { QuestionDto } from './dto/question.dto'
import { QuestionService } from './question.service'

@Controller('question')
export class QuestionController {
    constructor(private readonly qs: QuestionService) { }

    @Post('')
    @UsePipes(ValidationPipe)
    async postQuestion(@Body() question : QuestionDto) : Promise<QuestionDto>{
        return this.qs.postQuestion(question);
    }
}
