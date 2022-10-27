import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class JoinRoomDto {
  @IsNotEmpty()
  @IsUUID()
  roomId: string;

  @IsString()
  password: string;
}
