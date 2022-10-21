import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsUUID()
  roomId: string;
}
