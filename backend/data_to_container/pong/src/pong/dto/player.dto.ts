import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Socket } from 'socket.io';


export class playerDto {

    @ApiProperty({ description: 'The player uid' })
    @IsNotEmpty({message: "userUid should be declared"})
    userUuid: string;

    @ApiProperty({ description: 'The player name' })
	@IsNotEmpty({message: "userName should be declared"})
    userName: string;

	@ApiProperty({ description: 'The player socket id' })
	socket: Socket;
}