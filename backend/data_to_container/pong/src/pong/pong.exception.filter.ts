import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch(WsException)
export class AllExceptionsFilter extends BaseWsExceptionFilter {
    catch(exception: WsException, host: ArgumentsHost) {
    super.catch(exception, host);
    const client = host.switchToWs().getClient() as Socket;
    client.emit("unauthorized");
  }
}