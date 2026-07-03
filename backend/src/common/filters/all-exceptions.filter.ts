import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let errorCode = 'INTERNAL_SERVER_ERROR';
    let errorMessage = 'Internal server error';
    let details = undefined;

    if (exception instanceof HttpException) {
      const response = exception.getResponse() as any;
      if (typeof response === 'object') {
        errorCode = response.errorCode || response.error || response.code || 'API_ERROR';
        errorMessage = response.message || exception.message;

        // Handle class-validator validation errors
        if (
          httpStatus === HttpStatus.UNPROCESSABLE_ENTITY ||
          httpStatus === HttpStatus.BAD_REQUEST
        ) {
          if (Array.isArray(response.message)) {
            errorCode = 'VALIDATION_ERROR';
            errorMessage = 'Validation failed';
            details = response.message;
          }
        }
      } else {
        errorMessage = exception.message;
      }
    } else if (exception instanceof Error) {
      errorMessage = exception.message;
    }

    const responseBody = {
      success: false,
      error: {
        code: errorCode,
        message: errorMessage,
        ...(details && { details }),
        ...(exception instanceof HttpException && typeof exception.getResponse() === 'object' && (exception.getResponse() as any).userId ? { userId: (exception.getResponse() as any).userId } : {})
      },
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
