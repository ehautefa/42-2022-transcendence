import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class InvitePlayerDto {

    @ApiProperty({ description: 'The invite player uid' })
    @IsNotEmpty({message: "user1uid should be declared"})
    user1uid: string;

    @ApiProperty({ description: 'The invited player uid' })
    @IsNotEmpty({message: "user2uid should be declared"})
    user2uid: string;

    @ApiProperty({ description: 'The invite player name' })
	@IsNotEmpty({message: "user1name should be declared"})
    user1name: string;

    @ApiProperty({ description: 'The invited player name' })
	@IsNotEmpty({message: "user2name should be declared"})
    user2name: string;
}