import { Controller, Request, Post, UseGuards, Get, Req, Param, UsePipes, ValidationPipe, Body, Res, ConsoleLogger, Head, Headers, createParamDecorator } from '@nestjs/common';
import { FortyTwoAuthGuard } from './guards/fortyTwoAuth.gards';
import { AuthService } from './auth.service';
import { FirstConnectionDto } from './dto/firstConnection.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guards';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @UseGuards(FortyTwoAuthGuard)
    @Get('login')
    login() {
        console.log("login in controller")
    }

    @ApiOperation({ summary: 'CallBack after acces_token received (from fortyTwoStrategy)' })
    @UseGuards(FortyTwoAuthGuard)
    @Get('42/callback')
    cb(@Req() req, @Res() res) {
        if (req.user) {
            console.log("username connected with", req.user);
            return this.authService.login(req, res);
        }
        res.redirect('/auth/login');
    }

    @UseGuards(JwtAuthGuard)
    @Get('protected')
    getHello(@Request() req): string {
        return req.user
    }

    // @UsePipes(ValidationPipe)
    // @Post('firstConnection')
    // firstConnection(@Body() data: FirstConnectionDto) {
        // return this.authService.firstConnection(data);
    // }

    // @Get('test')
    // test(@Req() req) {
        // console.log(req.headers.cookie);
        // return "test";
    // }
// 

    // @UseGuards(LocalAuthGuard)
    // @Post('login')
    // login(@Request() req) : any
    // {
    // return this.authService.login(req.user);
    // }

}