import { IsNotEmpty, IsUUID } from 'class-validator';

export class UuidDto {
  @IsNotEmpty()
  @IsUUID()
  uuid: string;
}
