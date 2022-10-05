import { IsNotEmpty } from "class-validator";

export class SendAlertDto {

    @IsNotEmpty({message: "userUuid should be declared"})
    userUuid: string;

	@IsNotEmpty({message: "message to send should be declared"})
    message: string;
}