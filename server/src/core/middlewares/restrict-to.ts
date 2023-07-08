import type { Role, User } from '@prisma/client'
import type { RequestHandler } from 'express'
import expressAsyncHandler from 'express-async-handler'
import createHttpError from 'http-errors'
import { StatusCodes } from 'http-status-codes'

export const restrictTo = (...roles: Role[]): RequestHandler =>
  expressAsyncHandler((_req, res, next) => {
    const user = res.locals.user as User
    const isAllowed = roles.includes(user.role)
    if (isAllowed) return next()
    return next(
      createHttpError(StatusCodes.FORBIDDEN, 'You are not allowed to perform this action'),
    )
  })
