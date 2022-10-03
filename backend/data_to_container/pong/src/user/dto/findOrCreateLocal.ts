import { IsNotEmpty, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class FindOrCreateUserLocalDto {

    @ApiProperty({ description: 'The user name' })
    @IsNotEmpty({message: "userName should be declared"})
    userName: string;
}