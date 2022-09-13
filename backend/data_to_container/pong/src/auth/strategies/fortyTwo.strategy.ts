import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-42";
import { UserService } from "src/user/user.service";

@Injectable()
//used when @useGuard(FortyTwoAuthGard)
//fuction received acces token from 42 api and create or find user in database
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      clientID: process.env.REACT_APP_CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALL_BACK_LOCATION,
      profileFields: {
        'id': 'id',
        'username': 'login'
      }
    }, async (access_token, refreshToken, profile, done) => {

      console.log(profile.id, "connected")
      const user = await userService.FindOrCreateUser({'userName': profile.username, 'user42Id': profile.id, 'accessToken42': access_token});
      return done(null, user);
    });
  }
}