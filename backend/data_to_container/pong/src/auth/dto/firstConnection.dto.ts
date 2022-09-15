import { IsNotEmpty } from "class-validator";

export class FirstConnectionDto {

    @IsNotEmpty({message: "code should be declared"})
    code: string;
}