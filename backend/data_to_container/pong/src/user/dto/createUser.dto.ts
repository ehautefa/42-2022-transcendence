import { IsNotEmpty, Length } from "class-validator";

export class CreateUserDto {

    @IsNotEmpty({message: "userName should be declared"})
    userName: string;

    @IsNotEmpty({message: "userPassword should be declared"})
    userPassword: string;

    @IsNotEmpty({message: "userPassword should be declared"})
    accessToken42: string;
}