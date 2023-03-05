import { z } from 'zod'

const emailSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email(),
})

const passwordSchema = z.object({
  password: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string',
    })
    .min(6, {
      message: 'Password must be at least 6 characters',
    }),
})

export type EmailSchema = z.infer<typeof emailSchema>
export type PasswordSchema = z.infer<typeof passwordSchema>
