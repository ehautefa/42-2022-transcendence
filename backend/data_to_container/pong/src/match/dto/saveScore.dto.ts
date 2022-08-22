import { IsNotEmpty } from "class-validator";

export class SaveScoreDto {
    @IsNotEmpty()
    matchId: string;

    @IsNotEmpty({message: "winnerUuid should be declared"})
    player1Uuid: string;

    @IsNotEmpty({message: "loserUuid should be declared"})
    player2Uuid: string;

    @IsNotEmpty({message: "score1 should be declared"})
    score1: number;

	@IsNotEmpty({message: "score2 should be declared"})
    score2: number;
}