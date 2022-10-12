import { IsNotEmpty, IsUUID } from 'class-validator';

export class FindAllMessagesInRoomDto {
  @IsUUID()
  @IsNotEmpty()
  roomId: string;
}
