import { IsNotEmpty, Length } from "class-validator";

export class FlipTwoFactorAuthDto {

    @IsNotEmpty({message: "userUuid should be declared"})
    userUuid: string;
}