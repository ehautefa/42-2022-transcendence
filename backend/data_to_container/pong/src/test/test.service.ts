import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository} from 'typeorm';
import { CreateQuizDto } from './dto/createQuizz.dto';
import { Quiz } from './quiz.entity';

@Injectable()
export class TestService {
    constructor(
        @InjectRepository(Quiz) private qr: Repository<Quiz>) { }

    getNB(nb_to_ret: number): string {
        nb_to_ret++;
        return ("nb = " + nb_to_ret);
    }
    async getQuizByUd(id: number) : Promise<Quiz> {
        // return await this.qr.findOne(id, {relations: ['questions']});
        return await this.qr.findOne(id);
    }

    async createNewQuiz(quiz : CreateQuizDto) {
        console.log('yoooooo')
        return await this.qr.save(quiz);

    }
}