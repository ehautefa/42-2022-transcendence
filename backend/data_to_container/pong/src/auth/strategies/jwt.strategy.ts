import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "src/user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly userService: UserService
    ) {
        super({
            failureRedirect: '/auth/login',
            jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
				let data : string = null;
				if (request?.cookies && request.cookies['access_token']) { 
					// check if access_token is in cookies
					data = request.cookies['access_token'];
				} else if (request['handshake']
                    && request['handshake']['headers']
                    && request['handshake']['headers']['access_token']){
					// if access_token is not in cookie check if it is in headers
					data = request['handshake']['headers']['access_token'];
                }
                return data
            }]),
            // passReqToCallback: true,
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SIGN //Protect in env file
        }, async (jwt_paylod, done) => {
            const user = await userService.getCompleteUser(jwt_paylod.userUuid);
            //check if user is undefined?
            // console.log(user)
            return done(null, user);
        });
    }

    // validate(payload: any) {
        // console.log('vali');
        // return {
            // userUuid: payload.userUuid,
        // };
    // }
}