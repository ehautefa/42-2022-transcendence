import { IsNotEmpty } from 'class-validator';
import { RoomType } from 'src/bdd/room.entity';

export class CreateRoomDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  ownerId: string;

  isProtected: boolean;

  password: string;

  type: RoomType;

  @IsNotEmpty()
  userIs: string;
}
