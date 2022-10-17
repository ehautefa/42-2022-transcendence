import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsUUID()
  senderId: string;

  @IsString()
  message: string;

  @IsNotEmpty()
  @IsUUID()
  roomId: string;
}
