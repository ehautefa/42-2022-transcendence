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
import { TwoFaAuthGuard } from './guards/2fa.guards';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) { }

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
        const access_token: string = await this.authService.login(user);
        res.setHeader('Set-Cookie', [access_token]);
        if (user.twoFactorAuth)
            return res.redirect('/twoFa');
        else
            return res.redirect(process.env.HOME_PAGE);
    }

    @ApiOperation({ summary: 'CallBack after authentification with fortyTwoStrategy)' })
    // @UseFilters(TwoFaExceptionFilter)
    @UseGuards(TwoFaAuthGuard)
    @Get('2fa/login/:tfacode')
    async login2fa(@Res({ passthrough: true }) res: Response, @Req() { user }: { user: user }, @Param('tfacode') tfaCode: string) {
        const access_token: string = await this.authService.login2fa(user, tfaCode);
        res.setHeader('Set-Cookie', [access_token]);
        return
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
