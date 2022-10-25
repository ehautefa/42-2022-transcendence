import { Controller, Request, Post, UseGuards, Get, Req, Param, UsePipes, ValidationPipe, Body, Res, ConsoleLogger, Head, Headers, createParamDecorator, UnauthorizedException, HttpCode, Response } from '@nestjs/common';
import { FortyTwoAuthGuard } from './guards/fortyTwoAuth.gards';
import { AuthService } from './auth.service';
import { FirstConnectionDto } from './dto/firstConnection.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guards';
import { FindOrCreateUserLocalDto } from 'src/user/dto/findOrCreateLocal';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { user } from 'src/bdd/users.entity';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) { }


    // @Get('localLogin/:userName')
    // @ApiOperation({ summary: 'Create a new user' })
    // @UsePipes(ValidationPipe)
    // async localLogin(@Req() req, @Res() res, @Param('userName') userName: string) {
    // const user = await this.userService.FindOrCreateUserLocal(userName);
    // res.cookie('access_token', this.jwtService.sign({ userUuid: user.userUuid }))
    // console.log("Local username connected with Uuid", user);
    // res.redirect(process.env.REACT_APP_HOME_PAGE);
    // }

    // @ApiOperation({ summary: 'CallBack after authentification with fortyTwoStrategy)' })
    // @UseGuards(FortyTwoAuthGuard)
    // @Get('login')
    // login(@Req() req, @Res() res) {
    // console.log("username connected with Uuid", req.user);
    // res.cookie('access_token', this.jwtService.sign({ userUuid: req.user.userUuid }))
    // if (req.headers.referer === process.env.REACT_APP_FRONT_URL + "/" || !req.headers.referer)
    // res.redirect(process.env.REACT_APP_HOME_PAGE);
    // else
    // res.redirect(req.headers.referer);
    // }
    // 

    // @Post('2fa/login')
    // @HttpCode(200)
    // @UseGuards(JwtAuthGuard)
    // async TwoFauthenticate(@Request() request, @Response() res, @Body() body) {
        // const isCodeValid = this.authService.isTwoFactorAuthenticationCodeValid(
            // body.twoFactorAuthenticationCode,
            // request.user,
        // );
// 
        // if (!isCodeValid) {
            // throw new UnauthorizedException('Wrong authentication code');
        // }
        // res.cookie('access_token', this.authService.loginWith2fa(request.user));
        // if (request.headers.referer === process.env.REACT_APP_FRONT_URL + "/" || !request.headers.referer)
            // res.redirect(process.env.REACT_APP_HOME_PAGE);
        // else
            // res.redirect(request.headers.referer);
    // }
// 
    @Get('localLogin/:userName')
    @ApiOperation({ summary: 'Create a new user' })
    @UsePipes(ValidationPipe)
    async localLogin(@Req() req, @Res() res, @Body() body, @Param('userName') userName: string) {

        const user = await this.userService.FindOrCreateUserLocal(userName);

        if (user.twoFactorAuth) {
            const isCodeValid = this.authService.isTwoFactorAuthenticationCodeValid(
                body.twoFactorAuthenticationCode,
                user,
            );
            if (!isCodeValid) {
                throw new UnauthorizedException('Wrong authentication code');
            }
            res.cookie('access_token', this.jwtService.sign({ userUuid: user.userUuid, isTwoFactorAuthenticated: true }))
        }
        else
            res.cookie('access_token', this.jwtService.sign({ userUuid: user.userUuid }))

        console.log("Local username connected with Uuid", user);
        // if (req.headers.referer === process.env.REACT_APP_FRONT_URL + "/" || !req.headers.referer)
        res.redirect(process.env.REACT_APP_HOME_PAGE);
        // else
        //     res.redirect(req.headers.referer);
    }

    @ApiOperation({ summary: 'CallBack after authentification with fortyTwoStrategy)' })
    @UseGuards(FortyTwoAuthGuard)
    @Get('login')
    login(@Req() req, @Res() res, @Body() body) {
        console.log("username connected with Uuid", req.user);
        if (req.user.twoFactorAuth) {
            const isCodeValid = this.authService.isTwoFactorAuthenticationCodeValid(
                body.twoFactorAuthenticationCode,
                req.user,
            );
            if (!isCodeValid) {
                throw new UnauthorizedException('Wrong authentication code');
            }
            res.cookie('access_token', this.jwtService.sign({ userUuid: req.user.userUuid, isTwoFactorAuthenticated: true }))
        }
        else
            res.cookie('access_token', this.jwtService.sign({ userUuid: req.user.userUuid }))
        console.log("username connected with Uuid", req.user);
        if (req.headers.referer === process.env.REACT_APP_FRONT_URL + "/" || !req.headers.referer)
            res.redirect(process.env.REACT_APP_HOME_PAGE);
        else
            res.redirect(req.headers.referer);
    }

    @Post('2fa/generateQrCode')
    @UseGuards(JwtAuthGuard)
    async register(@Response() response, @Request() request) {
        const { otpauthUrl } = await this.authService.generateTwoFactorAuthenticationSecret(request.user);

        return response.json(
            await this.authService.generateQrCodeDataURL(otpauthUrl),
        );
    }

    @Post('2fa/verify2FA')
    @UseGuards(JwtAuthGuard)
    async turnOnTwoFactorAuthentication(@Req() request, @Res() res, @Body() body) {
        console.log("code", body.twoFactorAuthenticationCode);
		const isCodeValid =
		this.authService.isTwoFactorAuthenticationCodeValid(
			body.twoFactorAuthenticationCode,
			request.user,
            );
        if (!isCodeValid) {
            throw new UnauthorizedException('Wrong authentication code');
        }
        await this.userService.enableTwoFactorAuth(request.user);
        res.cookie('access_token', this.jwtService.sign({ userUuid: request.user.userUuid, isTwoFactorAuthenticated: true }))
        res.send("2FA OK")
    }

}