import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  Logger,
} from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { QueryFailedError } from 'typeorm';

@Catch(BadRequestException, QueryFailedError, WsException)
export class ChatExceptionFilter extends BaseWsExceptionFilter {
  private logger: Logger = new Logger('ChatException');
  catch(exception: Error, host: ArgumentsHost) {
    this.logger.error(exception);
    if (exception instanceof BadRequestException) {
      console.error(host.getArgByIndex(1));
      console.error(exception.getResponse());
      // const error: WsException = new WsException({});
      // super.catch(error, host);
    }
    if (exception instanceof QueryFailedError) {
      console.error(host.getArgByIndex(1));
      console.error(exception.message);
      // const error: WsException = new WsException(exception.message);
      // super.catch(error, host);
    }
    if (exception instanceof WsException) {
      host.switchToWs().getClient().emit('exception', exception);
      super.catch(exception, host);
    }
  }
}
