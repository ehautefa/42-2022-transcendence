import { Injectable, Req, Res, Headers } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService
    ) { }

    async login(@Req() req, @Res() res) {
        if (req.user) {
            console.log("username connected with Uuid", req.user);
            const access_token = this.jwtService.sign({ userUuid: req.user.userUuid });
            res.cookie('access_token', access_token);
            // res.setHeader("Authorization", "Bearer " + access_token)
            if (req.headers.referer === process.env.REACT_APP_FRONT_URL + "/" || !req.headers.referer)
                res.redirect(process.env.REACT_APP_HOME_PAGE);
            else
                res.redirect(req.headers.referer);
        }
        else {
            res.redirect('/auth/login');

        }
    }
}
