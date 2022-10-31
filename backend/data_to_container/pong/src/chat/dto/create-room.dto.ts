import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { RoomType } from 'src/bdd/room.entity';

export class CreateRoomDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEnum(RoomType)
  type: RoomType;
}
