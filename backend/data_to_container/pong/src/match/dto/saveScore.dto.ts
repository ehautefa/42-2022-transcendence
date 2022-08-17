import { IsNotEmpty } from "class-validator";

export class SaveScoreDto {
    @IsNotEmpty()
    matchId: string;

    @IsNotEmpty({message: "winnerUuid should be declared"})
    winnerUuid: string;

    @IsNotEmpty({message: "loserUuid should be declared"})
    loserUuid: string;

    @IsNotEmpty({message: "score1 should be declared"})
    score1: number;

	@IsNotEmpty({message: "score2 should be declared"})
    score2: number;
}