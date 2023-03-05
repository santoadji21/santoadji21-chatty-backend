import { z } from 'zod'

const signupSchema = z.object({
  username: z
    .string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string',
    })
    .min(2, {
      message: 'Name must be at least 2 characters',
    }),
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email(),
  password: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string',
    })
    .min(6, {
      message: 'Password must be at least 6 characters',
    }),
  avatarColor: z.string({
    required_error: 'Avatar color is required',
    invalid_type_error: 'Avatar color must be a string',
  }),
  avatarImage: z.string({
    required_error: 'Avatar image is required',
    invalid_type_error: 'Avatar image must be a string',
  }),
})

export type SignupSchema = z.infer<typeof signupSchema>
