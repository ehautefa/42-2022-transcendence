import { IsBoolean, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class PunishUserDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsUUID()
  roomId: string;

  @IsNotEmpty()
  @IsNumber()
  // @Transform((val) => val.)
  duration: number;

  @IsNotEmpty()
  @IsBoolean()
  isBanned: boolean;
}
