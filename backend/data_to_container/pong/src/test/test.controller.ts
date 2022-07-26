import { Body, Controller, Get, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateQuizDto } from './dto/createQuizz.dto';
import { TestService } from './test.service';

@Controller('/test')
export class TestController {
    // public i: number = 0;
    constructor(private readonly test_service: TestService) { }
    i: number = 0;


    @Get()
    getInfo(): number[] {
        return [1, 2, 3];
    }

    @Get('/nbr')
    getNbrCall(): string {
        return this.test_service.getNB(this.i);
    }

    @Post('/create')
    @UsePipes(ValidationPipe)
    @HttpCode(200)
    createQuizz(@Body() quizData : CreateQuizDto) {
        return { data : quizData };
    }
}
