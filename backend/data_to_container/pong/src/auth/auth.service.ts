import { Injectable, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { user } from 'src/bdd/users.entity';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { UserService } from 'src/user/user.service';
import { FirstConnectionDto } from './dto/firstConnection.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) { }


    //        "userId": "1fb3ca7d-34c3-4eb8-85e6-56ed45cf5e17"
    // https://www.youtube.com/watch?v=_L225zpUK0M&ab_channel=MariusEspejo

    // async validateUser(userUuid: string, userPassword: string): Promise<any> {
    // 
    // const user: user = await this.userService.getUser(userUuid);
    // if (user && user.userPassword === userPassword) {
    // const { userUuid, userPassword, ...rest } = user;
    // const { userPassword, ...rest } = user;
    // return rest;
    // }
    // else {
    // console.log('invalid user : ', userUuid);
    // }
    // return null;
    // }
    // 
    async login(user: user, @Res() res: Response) {
        const access_token = this.jwtService.sign({userUuid: user.userUuid});
        console.log("access_token =" , access_token);
        res.cookie('access_token', access_token);
        res.send();
        // res.redirect("http://localhost:3000/mainPage");
    }


    async firstConnection(dt: FirstConnectionDto) {

        var axios = require('axios');
        var qs = require('qs');
        var data = qs.stringify({
            'grant_type':
                'authorization_code',
            'client_id':
                process.env.REACT_APP_CLIENT_ID,
            'client_secret':
                process.env.CLIENT_SECRET,
            'code':
                dt.code,
            'redirect_uri':
                process.env.REACT_APP_REDIRECT_URI,
        });
        console.log("code = " + dt.code);
        var config = {
            method: 'post',
            url: "https://api.intra.42.fr/oauth/token",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        };

        console.log("first_co")
        let userToCreate: CreateUserDto;
        await axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
                userToCreate = { userName: "testFirstCo", userPassword: "testFirstCo", accessToken42: response.data.access_token };
                // const payload = this.userService.createUser({userName: "testFirstCo", userPassword: "testFirstCo", accessToken42: response.data.access_token})
                // return { access_token: this.jwtService.sign(payload), };
            })
            .catch(function (error) {
                console.log(error);
                return;
            });
        // const payload = await this.userService.createUser(userToCreate)

        // return { access_token: this.jwtService.sign(payload), };



    }
}
