import { IsNotEmpty  } from "class-validator";
import { user } from "src/bdd/users.entity";

export class addFriendResponseDto {
    @IsNotEmpty({message: "Inviter should be declared"})
    inviter: user;

    @IsNotEmpty({message: "response should be declared"})
    accept: boolean;
}