import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-42";
import { identity } from "rxjs";
import { user } from "src/bdd/users.entity";
import { UserService } from "src/user/user.service";

@Injectable()
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
// var FortyTwoStrategy = require('passport-42').Strategy;
// 
// passport.use(new FortyTwoStrategy({
  // },
  // function(accessToken, rerefreshToken, profile, cb) {
    // User.findOrCreate({ fortytwoId: profile.id }, function (err, user) {
      // return cb(err, user);
    // });
  // }
// ))