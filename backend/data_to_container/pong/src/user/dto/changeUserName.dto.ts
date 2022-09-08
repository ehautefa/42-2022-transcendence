import { IsNotEmpty, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ChangeUserNameDto {

    @ApiProperty({ description: 'The user uid' })
    @IsNotEmpty({message: "userUuid should be declared"})
    userUuid: string;

    @ApiProperty({example: 'csejault', description: 'The new username' })
    @IsNotEmpty({message: "newName should be declared"})
    newName: string;
}