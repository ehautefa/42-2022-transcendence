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

    login(user: user, twoFactorAuthenticationCode: string) :string {
        let cookie : string
        if (user.twoFactorAuth) {
            const isCodeValid = this.isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode, user);
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

    async generateTwoFactorAuthenticationSecret(user: user) {
        const secret = authenticator.generateSecret();

        const otpauthUrl = authenticator.keyuri(user.userName, process.env.REACT_APP_APP_NAME, secret);

        await this.userService.setTwoFactorAuthenticationSecret(user, secret);
        return { secret, otpauthUrl }
    }

    async generateQrCodeDataURL(otpAuthUrl: string) {
        return toDataURL(otpAuthUrl);
    }

    isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: user) {
        if (!twoFactorAuthenticationCode)
            return false
        return authenticator.verify({
            token: twoFactorAuthenticationCode,
            secret: user.twoFactorAuthenticationSecret,
        });
    }

    getCookieWithJwtAccessToken(userUuid: string, isTwoFactorAuthenticated: boolean) {
        const payload: TokenPayload = { userUuid, isTwoFactorAuthenticated};
        const token = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
            expiresIn: `${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}s`
        });
        console.log(`access_token=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}`);
        return `access_token=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}`;
    }

    // public getCookieWithJwtRefreshToken(userId: number) {
        // const payload: TokenPayload = { userId };
        // const token = this.jwtService.sign(payload, {
            // secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
            // expiresIn: `${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}s`
        // });
        // const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}`;
        // return {
            // cookie,
            // token
        // }
    // }
}
