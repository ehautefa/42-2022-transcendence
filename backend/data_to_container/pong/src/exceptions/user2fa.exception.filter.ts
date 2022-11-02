

import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { TwoFaCodeNotValidException, UserException } from './user.exception';

@Catch(TwoFaCodeNotValidException)
export class TwoFaExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.redirect('/twoFa');

  }
}
