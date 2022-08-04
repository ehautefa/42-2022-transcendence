import { IsNotEmpty} from "class-validator";

export class getUserDto {

    @IsNotEmpty()
    userUid: string;
}