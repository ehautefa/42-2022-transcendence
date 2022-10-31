import { IsNotEmpty, IsUUID } from 'class-validator';

export class DoubleUuidDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsUUID()
  roomId: string;
}
