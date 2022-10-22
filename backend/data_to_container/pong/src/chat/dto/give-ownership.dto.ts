import { IsNotEmpty, IsUUID } from 'class-validator';

export class GiveOwnershipDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsUUID()
  roomId: string;
}
