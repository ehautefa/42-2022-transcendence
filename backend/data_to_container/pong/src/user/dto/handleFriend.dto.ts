import { IsNotEmpty, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class HandleFriendDto {

    @ApiProperty({ description: 'The user uUid' })
    @IsNotEmpty({message: "userUuid should be declared"})
    userUuid: string;
}