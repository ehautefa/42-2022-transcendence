import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { JwtConfig } from '../config/Jwt.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super(
      {
        failureRedirect: '/auth/login',
        jwtFromRequest: ExtractJwt.fromExtractors([
          (request: Request) => {
            let data: string = null;
            if (request?.cookies && request.cookies['access_token']) {
              // check if access_token is in cookies
              data = request.cookies['access_token'];
            } else if (
              request['handshake'] &&
              request['handshake']['headers'] &&
              request['handshake']['headers']['access_token']
            ) {
              // if access_token is not in cookie check if it is in headers
              data = request['handshake']['headers']['access_token'];
            } else if (
              request['handshake'] &&
              request['handshake']['headers'] &&
              request['handshake']['headers'].cookie
            ) {
              data = request['handshake']['headers'].cookie
                .split(';')
                .find((c) => c.trim().startsWith('access_token='))
                .split('=')[1];
            }
            return data;
          },
        ]),
        ignoreExpiration: false,
        secretOrKey: JwtConfig.secret, //Protect in env file
      },
      async (jwt_paylod, done) => {
        const user = await userService.getCompleteUser(jwt_paylod.userUuid);
        if (user && user.twoFactorAuth !== undefined && !user.twoFactorAuth)
          return done(null, user);
        if (user.twoFactorAuth && jwt_paylod.isTwoFactorAuthenticated)
          return done(null, user);

        console.log('WARNING JWT - TwoFactorAuth ENABLE');
        console.log(jwt_paylod);
        return done(null, false);
      },
    );
  }
}
