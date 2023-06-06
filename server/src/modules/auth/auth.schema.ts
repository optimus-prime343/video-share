import { z } from 'zod'

import { PASSWORD_REGEX } from '../../core/constants/regex.js'
import { STRONG_PASSWORD_REQUIRED } from '../../core/constants/strings.js'

export const CreateAccountSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().refine(value => !PASSWORD_REGEX.test(value), {
      message: STRONG_PASSWORD_REQUIRED,
    }),
  }),
})
export const VerifyAccountSchema = z.object({
  params: z.object({
    verificationToken: z.string().min(64).max(64),
  }),
})
export const LoginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
})

export type CreateAccountPayload = z.infer<typeof CreateAccountSchema>['body']
export type VerifyAccountPayload = z.infer<typeof VerifyAccountSchema>['params']
export type LoginPayload = z.infer<typeof LoginSchema>['body']
