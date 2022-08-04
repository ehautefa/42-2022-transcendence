import { IsNotEmpty, Length } from "class-validator";

export class CreateUserDto {

    @IsNotEmpty({message: "userName should be declared"})
    userName: string;
}