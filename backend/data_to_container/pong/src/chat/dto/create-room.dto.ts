import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { RoomType } from 'src/bdd/room.entity';

export class CreateRoomDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsBoolean()
  isProtected: boolean;

  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEnum(RoomType)
  type: RoomType;
}
