import { IsNotEmpty } from "class-validator";

export class LoginDto {
    twoFactorAuthenticationCode: string
}