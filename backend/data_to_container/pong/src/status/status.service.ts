import { Injectable } from '@nestjs/common';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { JwtConfig } from 'src/auth/config/Jwt.config';
import TokenPayload from 'src/auth/tokenPayload.interface';

@Injectable()
export class StatusService {

    constructor(private readonly jwtService: JwtService) {}
    async getUserUuidFromCookies(cookie: string): Promise<string> {
        try {
            const accessToken: string = cookie
                .split('; ')
                .find((cookie: string) => cookie.startsWith('access_token='))
                .split('=')[1];
            const jwtOptions: JwtVerifyOptions = {
                secret: JwtConfig.secret,
            };
            const jwtPayload: TokenPayload = await this.jwtService.verify(
                accessToken,
                jwtOptions,
            );
            return jwtPayload.userUuid;
        } catch (error) {
            throw new WsException('Invalid access token');
        }
    }

    async handleConnection(cookie: string): Promise<string> {
        return await await this.getUserUuidFromCookies(cookie);
    }
}
