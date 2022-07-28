import { IsNotEmpty, Length } from "class-validator";

export class QuestionDto {

    @Length(3,255)
    @IsNotEmpty({message: "Question should have a name"})
    question_name: string;
}