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

    // @UseGuards(FortyTwoAuthGuard)
    // @ApiOperation({ summary: 'handle redirect to 42 api to authentification (from fortyTwoStrategy)' })
    // @Get('login')
    // login() {
        // console.log("login in controller")
    // }
// 
    @ApiOperation({ summary: 'CallBack after authentification with fortyTwoStrategy)' })
    @UseGuards(FortyTwoAuthGuard)
    @Get('login')
    login(@Req() req, @Res() res) {
            return this.authService.login(req, res);
    }

    @UseGuards(JwtAuthGuard)
    @Get('protected')
    getHello(@Request() req, @Res() res): string {
        console.log("protected access")
        console.log(req.user)
        res.send("This is protected ressources")
        return "fsdfsd"
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