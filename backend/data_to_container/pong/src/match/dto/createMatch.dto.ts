import { IsNotEmpty } from "class-validator";

export class CreateMatchDto {

    @IsNotEmpty({message: "user1 should be declared"})
    user1: string;

	@IsNotEmpty({message: "user2 should be declared"})
    user2: string;
}