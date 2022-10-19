import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';
import { RoomType } from 'src/bdd/room.entity';

export class CreateRoomDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsUUID()
  ownerId: string;

  @IsNotEmpty()
  @IsBoolean()
  isProtected: boolean;

  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEnum(RoomType)
  type: RoomType;

  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
