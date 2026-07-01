import { HttpException, HttpStatus } from '@nestjs/common';

export class MailException extends HttpException {
  constructor(message: string, errorDetails?: any) {
    super(
      {
        code: 'MAIL_ERROR',
        message,
        details: errorDetails,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
