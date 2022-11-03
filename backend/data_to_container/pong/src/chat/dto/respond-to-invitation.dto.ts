import { IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';

export class RespondToInvitationDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  roomId: string;

  @IsBoolean()
  @IsNotEmpty()
  acceptInvitation: boolean;
}
