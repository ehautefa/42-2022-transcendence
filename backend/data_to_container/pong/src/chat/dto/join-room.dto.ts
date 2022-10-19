import { IsAscii, IsNotEmpty } from 'class-validator';

export class JoinRoomDto {
  @IsNotEmpty()
  @IsAscii()
  roomName: string;
}
