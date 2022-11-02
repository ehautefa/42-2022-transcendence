import { Injectable, Req, Res, Headers, UnauthorizedException } from '@nestjs/common';
import { toDataURL } from 'qrcode';
import { JwtService } from '@nestjs/jwt';
import { authenticator } from 'otplib';
import { user } from 'src/bdd/users.entity';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import TokenPayload from './tokenPayload.interface';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
        private configService: ConfigService,
    ) { }

    async login(user: user, twoFactorAuthenticationCode: string): Promise<string> {
        let cookie: string
        if (user.twoFactorAuth) {
            const isCodeValid = await this.isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode, user);
            if (!isCodeValid)
                throw new UnauthorizedException('Wrong authentication code');
            // cookie = this.jwtService.sign({ userUuid: user.userUuid, isTwoFactorAuthenticated: true });
            cookie = this.getCookieWithJwtAccessToken(user.userUuid, true);
        }
        else
            // cookie = this.jwtService.sign({ userUuid: user.userUuid });
            cookie = this.getCookieWithJwtAccessToken(user.userUuid, false);
        console.log("username connected with Uuid", user);
        return cookie;
    }

    async generateTwoFactorAuthenticationSecret(user: user) : Promise<string> {
        const secret : string = authenticator.generateSecret();
        const otpauthUrl : string = authenticator.keyuri(user.userName, process.env.REACT_APP_APP_NAME, secret);
        await this.userService.setTwoFactorAuthenticationSecret(user, secret);
        return otpauthUrl;
    }

    async generateQrCodeDataURL(otpAuthUrl: string) : Promise<string> {
        return toDataURL(otpAuthUrl);
    }

    async isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: user) :Promise<boolean> {
        if (!twoFactorAuthenticationCode)
            return false
        const secret :string = await this.userService.getUserTwoFactorAuthenticationSecret(user)
        return authenticator.verify({
            token: twoFactorAuthenticationCode,
            secret: secret
        });
    }

    getCookieWithJwtAccessToken(userUuid: string, isTwoFactorAuthenticated: boolean) {
        const payload: TokenPayload = { userUuid, isTwoFactorAuthenticated };
        const token = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
            expiresIn: `${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}s`
        });
        // console.log(`access_token=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}`);
        // return `access_token=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}`;
        return `access_token=${token}; SameSite=strict; Path=/; Max-Age=${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}`;
    }
}
