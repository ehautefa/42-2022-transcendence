import { IsNotEmpty } from 'class-validator';

export class JoinDMRoomDto {
  @IsNotEmpty()
  senderId: string;

  @IsNotEmpty()
  recipientId: string;
}
