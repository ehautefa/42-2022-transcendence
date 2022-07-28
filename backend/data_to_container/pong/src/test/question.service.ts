import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository} from 'typeorm';
import { QuestionDto } from './dto/question.dto';
import { Question } from './question.entity'

@Injectable()
export class QuestionService {
    constructor(
        @InjectRepository(Question) private q: Repository<Question>) { }

    // async createNewQuiz(quiz : CreateQuizDto) {
        // console.log('yoooooo')
        // return await this.qr.save(quiz);
// 
    // }
    async postQuestion (question : QuestionDto) : Promise<QuestionDto>
    {

        return await this.q.save(question);
    }
}