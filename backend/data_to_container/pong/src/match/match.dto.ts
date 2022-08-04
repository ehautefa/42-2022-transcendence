import { IsNotEmpty, Length, matches } from "class-validator";
import { user } from "src/bdd/users.entity";

export class matchDto {
    @Length(3, 255)
    @IsNotEmpty({ message: "match should have an id" })
    matchId: string;

    @IsNotEmpty({message: "match should have a user1"})
    user1: user;
    
    score1: number;
    
    @IsNotEmpty({message: "match should have a user2"})
    user2: user;
    
    score2: number;
}

