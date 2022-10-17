import { IsNotEmpty, IsUUID } from 'class-validator';

export class JoinDMRoomDto {
  @IsNotEmpty()
  @IsUUID()
  recipientId: string;
}
