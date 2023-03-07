/* eslint-disable @typescript-eslint/no-explicit-any */
import { ZodRequestValidationError } from '@globals/helpers/error-handler'
import { Request, NextFunction } from 'express'
import { ZodError, ZodSchema } from 'zod'

export const zodValidation = (schema: ZodSchema<any>) => (target: any, key: string, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value

  descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
    try {
      const validatedBody = schema.parse(req.body)
      req.body = validatedBody
      return originalMethod.call(this, req, res, next)
    } catch (err) {
      if (err instanceof ZodError) {
        throw new ZodRequestValidationError(err.errors[0].message)
      }
      next(err)
    }
  }

  return descriptor
}
