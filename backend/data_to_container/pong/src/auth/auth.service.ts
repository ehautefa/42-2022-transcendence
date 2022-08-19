import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { user } from 'src/bdd/users.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {}


    //        "userId": "1fb3ca7d-34c3-4eb8-85e6-56ed45cf5e17"
    // https://www.youtube.com/watch?v=_L225zpUK0M&ab_channel=MariusEspejo

    async validateUser(userUuid: string, userPassword: string): Promise<any> {

        const user: user = await this.userService.getUser(userUuid);
        if (user && user.userPassword === userPassword) {
            // const { userUuid, userPassword, ...rest } = user;
            const { userPassword, ...rest } = user;
            return rest;
        }
        else {
            console.log('invalid user : ', userUuid);
        }
        return null;
    }

    async login(user: any) {
        const payload = { userName: user.userName, userUuid : user.userUuid};
        return { access_token: this.jwtService.sign(payload),};
    }
}
