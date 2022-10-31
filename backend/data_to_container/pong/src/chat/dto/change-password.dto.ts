import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsUUID()
  roomId: string;

  @IsString()
  password: string;

  @IsString()
  newPassword: string;
}
