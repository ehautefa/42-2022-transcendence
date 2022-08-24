import { IsNotEmpty, Length } from "class-validator";

export class ChangeUserNameDto {

    @IsNotEmpty({message: "userUuid should be declared"})
    userUuid: string;

    @IsNotEmpty({message: "newName should be declared"})
    newName: string;
}