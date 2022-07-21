import { IsNotEmpty, Length } from "class-validator";

export class CreateQuizDto {

    @Length(3,255)
    @IsNotEmpty({message: "quiz should have a title"})
    title: string;

    @Length(3)
    @IsNotEmpty({message: "quiz should have a descritpion"})
    description: string;
}