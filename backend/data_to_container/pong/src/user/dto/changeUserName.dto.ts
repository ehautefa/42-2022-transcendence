import { IsNotEmpty, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ChangeUserNameDto {

    @ApiProperty({example: 'csejault', description: 'The new username' })
    @IsNotEmpty({message: "newName should be declared"})
    newName: string;
}