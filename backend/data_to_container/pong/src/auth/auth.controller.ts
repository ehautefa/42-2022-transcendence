import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guards';

@Controller('')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // @Get()
    // test() {
        // return this.authService.validateUser("23035b2c-d21d-4b2c-9f3c-3b707d58aea8", "admin");
    // }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(@Request() req) : any
    {
        return req.user;
    }

    @Get('protected')
    getHello(): string {
        return ("Hello");
    }



}