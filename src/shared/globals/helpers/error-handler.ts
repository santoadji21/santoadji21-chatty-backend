import HTTP_STATUS from 'http-status-codes'

export interface IError {
  message: string
  statusCode: number
  status: string
}

export interface IErrorResponse {
  message: string
  statusCode: number
  status: string
  serializeErrors(): IError
}

export abstract class CustomError extends Error {
  abstract statusCode: number
  abstract status: string

  constructor(message: string) {
    super(message)

    Object.setPrototypeOf(this, CustomError.prototype)
  }

  serializeErrors(): IError {
    return {
      message: this.message,
      statusCode: this.statusCode,
      status: this.status,
    }
  }
}

export class BadRequestError extends CustomError {
  statusCode = HTTP_STATUS.BAD_REQUEST
  status = 'error'

  constructor(message: string) {
    super(message)

    Object.setPrototypeOf(this, BadRequestError.prototype)
  }
}

export class NotFoundError extends CustomError {
  statusCode = HTTP_STATUS.NOT_FOUND
  status = 'error'

  constructor(message: string) {
    super(message)

    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}

export class InternalServerError extends CustomError {
  statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR
  status = 'error'

  constructor(message: string) {
    super(message)

    Object.setPrototypeOf(this, InternalServerError.prototype)
  }
}

export class ServerError extends CustomError {
  statusCode = HTTP_STATUS.SERVICE_UNAVAILABLE
  status = 'error'

  constructor(message: string) {
    super(message)

    Object.setPrototypeOf(this, ServerError.prototype)
  }
}

export class UnauthorizedError extends CustomError {
  statusCode = HTTP_STATUS.UNAUTHORIZED
  status = 'error'

  constructor(message: string) {
    super(message)

    Object.setPrototypeOf(this, UnauthorizedError.prototype)
  }
}

export class ForbiddenError extends CustomError {
  statusCode = HTTP_STATUS.FORBIDDEN
  status = 'error'

  constructor(message: string) {
    super(message)

    Object.setPrototypeOf(this, ForbiddenError.prototype)
  }
}

export class ValidationError extends CustomError {
  statusCode = HTTP_STATUS.UNPROCESSABLE_ENTITY
  status = 'error'

  constructor(message: string) {
    super(message)

    Object.setPrototypeOf(this, ValidationError.prototype)
  }
}

export class JoiValidationError extends CustomError {
  statusCode = HTTP_STATUS.UNPROCESSABLE_ENTITY
  status = 'error'

  constructor(message: string) {
    super(message)

    Object.setPrototypeOf(this, JoiValidationError.prototype)
  }
}

export class ConflictError extends CustomError {
  statusCode = HTTP_STATUS.CONFLICT
  status = 'error'

  constructor(message: string) {
    super(message)

    Object.setPrototypeOf(this, ConflictError.prototype)
  }
}

export class UnprocessableEntityError extends CustomError {
  statusCode = HTTP_STATUS.UNPROCESSABLE_ENTITY
  status = 'error'

  constructor(message: string) {
    super(message)

    Object.setPrototypeOf(this, UnprocessableEntityError.prototype)
  }
}
