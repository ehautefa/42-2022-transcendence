import { IsNotEmpty, Length } from "class-validator";

export class EndOfMatchDto {

    @IsNotEmpty()
    winnerUid: string;

    @IsNotEmpty()
    loserUid: string;
}