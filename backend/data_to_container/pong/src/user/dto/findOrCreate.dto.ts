import { IsNotEmpty, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class FindOrCreateUserDto {

    @ApiProperty({ description: 'The user id from 42' })
    @IsNotEmpty({message: "user42Id should be declared"})
    user42Id: string;

    @ApiProperty({ description: 'The user name' })
    @IsNotEmpty({message: "userName should be declared"})
    userName: string;
}