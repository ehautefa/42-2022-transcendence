import { IsNotEmpty } from 'class-validator';
import { RoomType } from 'src/bdd/room.entity';

export class CreateRoomDto {
  name: string;

  @IsNotEmpty()
  type: RoomType;
}
