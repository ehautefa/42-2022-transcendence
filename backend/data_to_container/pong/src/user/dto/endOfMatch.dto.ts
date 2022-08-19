import { IsNotEmpty, Length } from "class-validator";

export class EndOfMatchDto {

    @IsNotEmpty()
    winnerUuid: string;

    @IsNotEmpty()
    loserUuid: string;
}
