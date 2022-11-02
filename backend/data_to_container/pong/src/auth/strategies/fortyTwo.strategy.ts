import { ConsoleLogger, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-42";
import { UserService } from "src/user/user.service";

@Injectable()
//used when @useGuard(FortyTwoAuthGard)
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    private configService: ConfigService
    ) {
    super({
      clientID: configService.get('FT_CLIENT_ID'),
      clientSecret: configService.get('FT_CLIENT_SECRET'),
      callbackURL: configService.get('REDIRECT_URI'),
      // callbackURL: 'https://localhost:4443/auth/login/'
      //verify function
    }, async (access_token, refreshToken, profile, done) => {

      const user = await userService.FindOrCreateUser(profile.id, profile.username);
      if (!user)
        return done(null, false)
      return done(null, user);
      // }
    });
  }
}