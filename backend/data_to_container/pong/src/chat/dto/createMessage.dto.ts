import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsUUID()
  senderId: string;

  @IsNotEmpty()
  message: string;

  @IsNotEmpty()
  @IsUUID()
  roomId: string;
}
