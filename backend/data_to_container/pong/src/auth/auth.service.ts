import { Injectable, Req, Res, Headers } from '@nestjs/common';
import { toDataURL } from 'qrcode';
import { JwtService } from '@nestjs/jwt';
import { authenticator } from 'otplib';
import { user } from 'src/bdd/users.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UserService
    ) { }

    async login(@Req() req, @Res() res) {
        console.log("username connected with Uuid", req.user);
        const access_token = this.jwtService.sign({ userUuid: req.user.userUuid });
        res.cookie('access_token', access_token);
        // res.setHeader("Authorization", "Bearer " + access_token)
        if (req.headers.referer === process.env.REACT_APP_FRONT_URL + "/" || !req.headers.referer)
            res.redirect(process.env.REACT_APP_HOME_PAGE);
        else
            res.redirect(req.headers.referer);
    }

    async loginWith2fa(userWithoutPsw: Partial<user>) {
        const payload = {
            userUuid: userWithoutPsw.userUuid,
            isTwoFactorAuthenticated: true,
        };

        return this.jwtService.sign(payload)
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

    // public getCookieWithJwtAccessToken(userId: number) {
        // const payload: TokenPayload = { userId };
        // const token = this.jwtService.sign(payload, {
            // secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
            // expiresIn: `${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}s`
        // });
        // return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}`;
    // }
// 
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
