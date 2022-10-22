import { IsNotEmpty, IsString } from 'class-validator';

export class StringDto {
  @IsNotEmpty()
  @IsString()
  str: string;
}
