import { Controller, Request, Post, UseGuards, Get, Req, Param, UsePipes, ValidationPipe, Body, Res, ConsoleLogger, Head, Headers, createParamDecorator } from '@nestjs/common';
import { FortyTwoAuthGuard } from './guards/fortyTwoAuth.gards';
import { AuthService } from './auth.service';
import { FirstConnectionDto } from './dto/firstConnection.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guards';
import { FindOrCreateUserLocalDto } from 'src/user/dto/findOrCreateLocal';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService
    ) { }

    @Get('localLogin/:userName')
    @ApiOperation({ summary: 'Create a new user' })
    @UsePipes(ValidationPipe)
    async localLogin(@Req() req, @Res() res, @Param ('userName') userName: string) {
        const user = await this.userService.FindOrCreateUserLocal(userName);
        res.cookie('access_token', this.jwtService.sign({ userUuid: user.userUuid }))
        console.log("Local username connected with Uuid", user);
        if (req.headers.referer === process.env.REACT_APP_FRONT_URL + "/" || !req.headers.referer)
            res.redirect(process.env.REACT_APP_HOME_PAGE);
        else
            res.redirect(req.headers.referer);
    }

    @ApiOperation({ summary: 'CallBack after authentification with fortyTwoStrategy)' })
    @UseGuards(FortyTwoAuthGuard)
    @Get('login')
    login(@Req() req, @Res() res) {
        console.log("username connected with Uuid", req.user);
        res.cookie('access_token', this.jwtService.sign({ userUuid: req.user.userUuid }))
        if (req.headers.referer === process.env.REACT_APP_FRONT_URL + "/" || !req.headers.referer)
            res.redirect(process.env.REACT_APP_HOME_PAGE);
        else
            res.redirect(req.headers.referer);
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