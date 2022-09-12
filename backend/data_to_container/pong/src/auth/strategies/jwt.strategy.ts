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
            jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
                console.log("constructor jwt");
                let data = request?.cookies['access_token']
                if (!data) {
                    return null;
                }
                console.log("token = ", request.cookies['access_token']);
                return data
            }]),
            // passReqToCallback: true,
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SIGN //Protect in env file
        }, async (jwt_paylod, done) => {
            const user = await userService.getUser(jwt_paylod.userUuid);
            console.log(user)
            return done(null, user);
        });
    }

    validate(payload: any) {
        console.log('vali');
        return {
            id: payload.userUuid,
            // name: payload.userName,
        };
    }
}