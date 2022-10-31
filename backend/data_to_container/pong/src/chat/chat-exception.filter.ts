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
      // const error: WsException = new WsException(exception.message);
      // super.catch(exception, host);
      console.error(host.getArgByIndex(1));
      console.error(exception.getResponse());
    }
    if (exception instanceof QueryFailedError) {
      const error: WsException = new WsException(exception.message);
      super.catch(error, host);
      console.error(host.getArgByIndex(1));
      console.error(exception.message);
    }
    if (exception instanceof WsException) {
      super.catch(exception, host);
    }
  }
}
