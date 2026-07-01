export class ApiError extends Error {
  public statusCode: number;
  public data?: unknown;

  constructor(message: string, statusCode: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized', data?: unknown) {
    super(message, 401, data);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'غير مصرح لك بالوصول', data?: unknown) {
    super(message, 403, data);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'المورد غير موجود', data?: unknown) {
    super(message, 404, data);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends ApiError {
  constructor(message: string = 'Validation Error', data?: unknown) {
    super(message, 422, data);
    this.name = 'ValidationError';
  }
}

export class ServerError extends ApiError {
  constructor(message: string = 'Internal Server Error', data?: unknown) {
    super(message, 500, data);
    this.name = 'ServerError';
  }
}
