

import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, response, Response } from 'express';
import { UserException } from './user.exception';

@Catch(UserException)
export class UserExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response
      .status(status)
      .json({
        statusCode: status,
        exception: exception,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}
