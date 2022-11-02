import { IsNotEmpty } from "class-validator";

export class LoginDto {
    @IsNotEmpty({message: "twoFactorAuthenticationCode should be declared"})
    twoFactorAuthenticationCode: string
}