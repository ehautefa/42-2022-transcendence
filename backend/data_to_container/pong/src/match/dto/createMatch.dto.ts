import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateMatchDto {

    @ApiProperty({ description: 'The first player uid' })
    @IsNotEmpty({message: "user1uid should be declared"})
    user1uid: string;

    @ApiProperty({ description: 'The second player uid' })
	@IsNotEmpty({message: "user2uid should be declared"})
    user2uid: string;
}