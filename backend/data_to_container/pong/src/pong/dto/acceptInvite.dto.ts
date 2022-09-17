import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AcceptInviteDto {

    @ApiProperty({ description: 'The player uid' })
    @IsNotEmpty({message: "userUuid should be declared"})
    userUuid: string;

    @ApiProperty({ description: 'The player name' })
	@IsNotEmpty({message: "userName should be declared"})
    userName: string;

    @ApiProperty({ description: 'The match id' })
    @IsNotEmpty({message: "matchId should be declared"})
    matchId: string;
}