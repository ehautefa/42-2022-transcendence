import { IsNotEmpty } from "class-validator";

export class invitePlayerDto {

    @IsNotEmpty({message: "invitedUserName should be declared"})
    invitedUserName: string;

    @IsNotEmpty({message: "invitedUserUuid should be declared"})
    invitedUserUuid: string;
}