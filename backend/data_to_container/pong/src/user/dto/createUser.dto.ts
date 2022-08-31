import { IsNotEmpty, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {

    @ApiProperty({ description: 'The user name' })
    @IsNotEmpty({message: "userName should be declared"})
    userName: string;

    @ApiProperty({ description: 'The user password' })
    @IsNotEmpty({message: "userPassword should be declared"})
    userPassword: string;
}