import { Controller, Request, Post, UseGuards, Get, Req, Param, UsePipes, ValidationPipe, Body, Res, ConsoleLogger, Head, Headers, createParamDecorator, UnauthorizedException, HttpCode, Response } from '@nestjs/common';
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
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) { }

    @Get('localLogin/:userName')
    @ApiOperation({ summary: 'Create a new user' })
    @UsePipes(ValidationPipe)
    async localLogin(@Req() req, @Res() res, @Param('userName') userName: string) {
        const user = await this.userService.FindOrCreateUserLocal(userName);
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

    
    @Post('2fa/generate')
  @UseGuards(JwtAuthGuard)
  async register(@Response() response, @Request() request) {
    const { otpauthUrl } =
      await this.authService.generateTwoFactorAuthenticationSecret(
        request.user,
      );

    return response.json(
      await this.authService.generateQrCodeDataURL(otpauthUrl),
    );
  }

    @Post('2fa/turn-on')
    @UseGuards(JwtAuthGuard)
    async turnOnTwoFactorAuthentication(@Req() request, @Body() body) {
        const isCodeValid =
            this.authService.isTwoFactorAuthenticationCodeValid(
                body.twoFactorAuthenticationCode,
                request.user,
            );
        if (!isCodeValid) {
            throw new UnauthorizedException('Wrong authentication code');
        }
        await this.userService.enableTwoFactorAuth(request.user);
    }

    @Post('2fa/authenticate')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    async authenticate(@Request() request, @Body() body) {
        const isCodeValid = this.authService.isTwoFactorAuthenticationCodeValid(
            body.twoFactorAuthenticationCode,
            request.user,
        );

        if (!isCodeValid) {
            throw new UnauthorizedException('Wrong authentication code');
        }

        return this.authService.loginWith2fa(request.user);
    }
}