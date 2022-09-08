import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class getPlayerDto {

    @ApiProperty({ description: 'The player uid' })
    @IsNotEmpty({message: "userUid should be declared"})
    userUuid: string;

    @ApiProperty({ description: 'The player name' })
	@IsNotEmpty({message: "userName should be declared"})
    userName: string;
}