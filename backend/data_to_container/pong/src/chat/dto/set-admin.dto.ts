import { IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';

export class SetAdminDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsUUID()
  roomId: string;

  @IsNotEmpty()
  @IsBoolean()
  isAdmin: boolean;
}
