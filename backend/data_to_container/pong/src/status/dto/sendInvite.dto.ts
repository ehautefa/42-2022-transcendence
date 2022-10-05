import { IsNotEmpty } from "class-validator";

export class SendInviteDto {

    @IsNotEmpty({message: "invitedUserUuid should be declared"})
    invitedUserUuid: string;

	@IsNotEmpty({message: "invitedUserName should be declared"})
    invitedUserName: string;

    @IsNotEmpty({message: "matchId should be declared"})
    matchId: string;
}