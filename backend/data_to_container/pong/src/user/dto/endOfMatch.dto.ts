import { IsNotEmpty, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class EndOfMatchDto {

    @ApiProperty({ description: 'The winner uid' })
    @IsNotEmpty()
    winnerUuid: string;

    @ApiProperty({ description: 'The loser uid' })
    @IsNotEmpty()
    loserUuid: string;
}
