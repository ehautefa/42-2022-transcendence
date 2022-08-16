import { IsNotEmpty } from "class-validator";

export class CreateMatchDto {

    @IsNotEmpty({message: "user1uid should be declared"})
    user1uid: string;

	@IsNotEmpty({message: "user2uid should be declared"})
    user2uid: string;
}