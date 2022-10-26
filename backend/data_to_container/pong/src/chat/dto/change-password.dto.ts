import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsUUID()
  roomId: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
