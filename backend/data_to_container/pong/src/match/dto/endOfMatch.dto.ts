import { IsNotEmpty } from "class-validator";

export class EndOfMatchDto {

    @IsNotEmpty({message: "score1 should be declared"})
    score1: number;

	@IsNotEmpty({message: "score2 should be declared"})
    score2: number;
}