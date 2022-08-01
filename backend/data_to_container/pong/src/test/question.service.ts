import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionDto } from './dto/question.dto';
import { Question } from './question.entity'
import { Quiz } from './quiz.entity';

@Injectable()
export class QuestionService {
    constructor(
        @InjectRepository(Question) private q: Repository<Question>) { }

    async postQuestion(question: QuestionDto, quiz: Quiz): Promise<Question> {

        const new_question = await this.q.save({
            question_name : question.question_name,
        });
        quiz.questions = [...quiz.questions, new_question];
        await quiz.save();
        return new_question;
    }
}