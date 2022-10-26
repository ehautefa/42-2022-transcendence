import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { QueryFailedError } from 'typeorm';

@Catch(WsException, HttpException, QueryFailedError)
export class AllExceptionsFilter extends BaseWsExceptionFilter {
    catch(exception: WsException | HttpException | QueryFailedError, host: ArgumentsHost) {
    super.catch(exception, host);
    const client = host.switchToWs().getClient() as Socket;
    client.emit("unauthorized");
  }
}