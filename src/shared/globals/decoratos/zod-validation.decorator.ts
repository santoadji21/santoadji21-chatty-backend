/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ZodType, ZodError } from 'zod'
import { Request, Response, NextFunction } from 'express'

function validate(schema: ZodType<any>) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const validatedBody = schema.parse(req.body)
      req.body = validatedBody
      next()
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({
          error: err.errors.map((error) => error.message),
        })
      } else {
        next(err)
      }
    }
  }
}

export function validation(schema: ZodType<any>) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value

    descriptor.value = function (req: Request, res: Response, next: NextFunction) {
      validate(schema)(req, res,  (err?: any) => {
        if (err) {
          next(err)
        } else {
          originalMethod.apply(this, arguments)
        }
      })
    }

    return descriptor
  }
}
