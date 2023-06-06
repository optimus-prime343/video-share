import { Router } from 'express'

import { authRequired } from '../../core/middlewares/auth-required.js'
import { validateResource } from '../../core/middlewares/validate-resource.js'
import {
  createAccount,
  login,
  profile,
  refreshToken,
  verifyAccount,
} from './auth.controller.js'
import { CreateAccountSchema, LoginSchema, VerifyAccountSchema } from './auth.schema.js'

const authRouter = Router()

authRouter.post('/login', validateResource(LoginSchema), login)
authRouter.post('/create-account', validateResource(CreateAccountSchema), createAccount)
authRouter.get(
  '/verify-account/:verificationToken',
  validateResource(VerifyAccountSchema),
  verifyAccount,
)
authRouter.get('/refresh-token', authRequired, refreshToken)
authRouter.get('/profile', authRequired, profile)

export { authRouter }
