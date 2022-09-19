import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SendInviteDto {

    @ApiProperty({ description: 'The invited player uid' })
    @IsNotEmpty({message: "invitedUserUuid should be declared"})
    invitedUserUuid: string;

    @ApiProperty({ description: 'The invited player name' })
	@IsNotEmpty({message: "invitedUserName should be declared"})
    invitedUserName: string;

    @ApiProperty({ description: 'The match id' })
    @IsNotEmpty({message: "matchId should be declared"})
    matchId: string;
}