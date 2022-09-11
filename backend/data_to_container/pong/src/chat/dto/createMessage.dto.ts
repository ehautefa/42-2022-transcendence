import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  name: string;

  message: string;

  @IsUUID()
  room: string;
}
