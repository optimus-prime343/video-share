import { z } from 'zod'

export const SignupSchema = z.object({
  useranme: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(10),
})

export type SignupFormData = z.infer<typeof SignupSchema>
