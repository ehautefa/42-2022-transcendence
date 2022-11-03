import { IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';

export class RespondToInvitationDto {
  @IsUUID()
  @IsNotEmpty()
  roomId: string;

  @IsBoolean()
  @IsNotEmpty()
  acceptInvitation: boolean;
}
