import { Controller, Request, Post, UseGuards, Get, Req, Param, UsePipes, ValidationPipe, Body, Res, UnauthorizedException, UseFilters, } from '@nestjs/common';
import { FortyTwoAuthGuard } from './guards/fortyTwoAuth.gards';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guards';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { user } from 'src/bdd/users.entity';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { TwoFaExceptionFilter } from 'src/exceptions/user2fa.exception.filter';

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
    async localLogin(@Res({ passthrough: true }) res: Response, @Body() tfaCode: LoginDto, @Param('userName') userName: string) {

        const user: user = await this.userService.FindOrCreateUserLocal(userName);
        // if(user.twoFactorAuth)
        // res.redirect('/2fa');
        const access_token: string = await this.authService.login2fa(user, tfaCode.twoFactorAuthenticationCode);
        res.setHeader('Set-Cookie', access_token);
        return `user : #${user.userName} is logged-in`
    }

    @ApiOperation({ summary: 'CallBack after authentification with fortyTwoStrategy)' })
    @UseGuards(FortyTwoAuthGuard)
    @Get('login')
    async login(@Res({ passthrough: true }) res: Response, @Req() { user }: { user: user }) {
        if (user.twoFactorAuth)
            res.redirect('/twoFa');
        else {
            const access_token: string = await this.authService.login(user);
            res.setHeader('Set-Cookie', [access_token]);
            res.redirect('/mainPage');
        }
    }

    @ApiOperation({ summary: 'CallBack after authentification with fortyTwoStrategy)' })
    @UseFilters(TwoFaExceptionFilter)
    @UseGuards(FortyTwoAuthGuard)
    @UsePipes(LoginDto)
    @Get('login2fa/:tfacode')
    async login2fa(@Res({ passthrough: true }) res: Response, @Req() { user }: { user: user }, @Param() tfaCode: LoginDto) {
        const access_token: string = await this.authService.login2fa(user, tfaCode.twoFactorAuthenticationCode);
        res.setHeader('Set-Cookie', [access_token]);
        res.redirect(process.env.HOME_PAGE);
    }

    @Post('2fa/generateQrCode')
    @UseGuards(JwtAuthGuard)
    async register(@Request() { user }: { user: user }) {
        const otpauthUrl: string = await this.authService.generateTwoFactorAuthenticationSecret(user);
        return await this.authService.generateQrCodeDataURL(otpauthUrl);
    }

    @Post('2fa/verify2FA')
    @UseGuards(JwtAuthGuard)
    async turnOnTwoFactorAuthentication(@Req() { user }: { user: user }, @Res({ passthrough: true }) res, @Body() tfaCode: LoginDto) {
        const isCodeValid =
            await this.authService.isTwoFactorAuthenticationCodeValid(
                tfaCode.twoFactorAuthenticationCode,
                user,
            );
        if (!isCodeValid) {
            throw new UnauthorizedException('Wrong authentication code');
        }
        await this.userService.enableTwoFactorAuth(user);
        const access_token: string = this.authService.getCookieWithJwtAccessToken(user.userUuid, true);
        res.setHeader('Set-Cookie', [access_token]);
        return `2FA Ok for #${user.userName}.\n access_token=${access_token}`
    }
}