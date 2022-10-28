import { IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';

export class FilterUsersDto {
  @IsUUID()
  @IsNotEmpty()
  roomId: string;

  @IsBoolean()
  @IsNotEmpty()
  admin: boolean;

  @IsBoolean()
  @IsNotEmpty()
  banned: boolean;

  @IsBoolean()
  @IsNotEmpty()
  muted: boolean;
}
