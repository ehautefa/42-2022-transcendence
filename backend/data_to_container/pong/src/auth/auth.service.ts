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
            isTwoFactorAuthenticationEnabled: !!userWithoutPsw.twoFactorAuth,
            isTwoFactorAuthenticated: true,
        };

        return {
            userUuid: payload.userUuid,
            access_token: this.jwtService.sign(payload),
        };
    }

    async generateTwoFactorAuthenticationSecret(user: user) {
        const secret = authenticator.generateSecret();

        // const otpauthUrl = authenticator.keyuri(user.email, 'AUTH_APP_NAME', secret);
        const otpauthUrl = authenticator.keyuri(user.userUuid, process.env.REACT_APP_APP_NAME, secret);

        await this.userService.setTwoFactorAuthenticationSecret(user, secret);
        return {
            secret,
            otpauthUrl
        }
    }

    async generateQrCodeDataURL(otpAuthUrl: string) {
        return toDataURL(otpAuthUrl);
    }

    isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: user) {
        return authenticator.verify({
            token: twoFactorAuthenticationCode,
            secret: user.twoFactorAuthenticationSecret,
        });
    }
}
