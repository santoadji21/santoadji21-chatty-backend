import { z } from 'zod'

const signinSchema = z.object({
  username: z
    .string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string',
    })
    .min(2, {
      message: 'Name must be at least 2 characters',
    }),
  password: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string',
    })
    .min(6, {
      message: 'Password must be at least 6 characters',
    }),
})

export { signinSchema }
