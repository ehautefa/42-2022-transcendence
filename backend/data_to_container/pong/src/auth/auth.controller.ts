import { Controller, Request, Post, UseGuards, Get, Req, Param, UsePipes, ValidationPipe, Body, Res, ConsoleLogger } from '@nestjs/common';
import { FortyTwoAuthGuard } from './42-auth.guards';
import { AuthService } from './auth.service';
import { FirstConnectionDto } from './dto/firstConnection.dto';
import { JwtAuthGuard } from './jwt-auth.guards';
import { LocalAuthGuard } from './local-auth.guards';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // @Get()
    // test() {
    // return this.authService.validateUser("23035b2c-d21d-4b2c-9f3c-3b707d58aea8", "admin");
    // }

    @UsePipes(ValidationPipe)
    @Post('firstConnection')
    firstConnection(@Body() data: FirstConnectionDto) {
        return this.authService.firstConnection(data);
    }

    @UseGuards(FortyTwoAuthGuard)
    @Get('login')
    login() {
        console.log("testauth ")

    }

    @UseGuards(FortyTwoAuthGuard)
    @Get('42/callback')
    cb(@Req() req, @Res() res) {
        if (req.user) {
            console.log("username connected with", req.user);
            return this.authService.login(req.user, res);
        }
        res.redirect('/auth/login');
    }


    // @UseGuards(LocalAuthGuard)
    // @Post('login')
    // login(@Request() req) : any
    // {
    // return this.authService.login(req.user);
    // }

    @UseGuards(JwtAuthGuard)
    @Get('protected')
    getHello(@Request() req): string {
        return req.user
    }
}