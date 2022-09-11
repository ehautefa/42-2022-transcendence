import { IsNotEmpty } from 'class-validator';
import { RoomType } from 'src/bdd/room.entity';

export class createRoomDto {
  name: string;

  @IsNotEmpty()
  type: RoomType;
}
