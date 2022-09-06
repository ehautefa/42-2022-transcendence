import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class invitePlayerDto {

    @ApiProperty({ description: 'The player uid' })
    @IsNotEmpty({message: "userUid should be declared"})
    userUuid: string;

    @ApiProperty({ description: 'The player name' })
	@IsNotEmpty({message: "userName should be declared"})
    userName: string;

    @ApiProperty({ description: 'The invited player uid'})
    @IsNotEmpty({message: "invitedPlayerUid should be declared"})
    invitedUid: string;

    @ApiProperty({ description: 'The game id'})
    id: number;
}