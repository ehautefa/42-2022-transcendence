import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsUUID()
  senderId: string;

  message: string;

  @IsNotEmpty()
  @IsUUID()
  roomId: string;
}
