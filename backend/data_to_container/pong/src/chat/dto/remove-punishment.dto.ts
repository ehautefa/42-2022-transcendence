import { IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';

export class RemovePunishmentDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsUUID()
  roomId: string;

  @IsNotEmpty()
  @IsBoolean()
  unMute: boolean;
}
