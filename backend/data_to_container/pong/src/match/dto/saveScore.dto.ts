import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SaveScoreDto {
    @ApiProperty({ description: 'The match uid' })
    @IsNotEmpty()
    matchId: string;

    @ApiProperty({ description: 'The first player uid' })
    @IsNotEmpty({message: "player1Uuid should be declared"})
    player1Uuid: string;

    @ApiProperty({ description: 'The second player uid' })
    @IsNotEmpty({message: "player2Uuid should be declared"})
    player2Uuid: string;

    @ApiProperty({example: '0', description: 'The first player score' })
    @IsNotEmpty({message: "score1 should be declared"})
    score1: number;

    @ApiProperty({example: '10', description: 'The second player score' })
	@IsNotEmpty({message: "score2 should be declared"})
    score2: number;
}