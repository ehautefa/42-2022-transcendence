import { IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';

export class FilterByAdminRightsDto {
  @IsUUID()
  @IsNotEmpty()
  roomId: string;

  @IsBoolean()
  @IsNotEmpty()
  isAdmin: boolean;
}
