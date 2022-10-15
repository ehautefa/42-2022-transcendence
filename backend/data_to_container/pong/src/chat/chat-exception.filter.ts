import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  Logger,
} from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';

@Catch()
export class ChatExceptionFilter extends BaseWsExceptionFilter {
  private logger: Logger = new Logger('ChatException');
  catch(exception: unknown, host: ArgumentsHost) {
    this.logger.error(exception);
    if (exception instanceof BadRequestException) {
      console.error(host.getArgByIndex(1));
      console.error(exception.getResponse());
    } else super.catch(exception, host);
  }
}
