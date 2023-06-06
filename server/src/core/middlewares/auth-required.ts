import expressAsyncHandler from 'express-async-handler'
import createHttpError from 'http-errors'
import { StatusCodes } from 'http-status-codes'

import { ACCESS_TOKEN_NAME, UNAUTHORIZED } from '../constants/strings.js'
import { verifyJwt } from '../lib/jsonwebtoken.js'
import { db } from '../lib/prisma.js'

export const authRequired = expressAsyncHandler(async (req, res, next) => {
  const accessToken = req.cookies[ACCESS_TOKEN_NAME]
  if (!accessToken) return next(createHttpError(StatusCodes.UNAUTHORIZED, UNAUTHORIZED))
  const { id } = await verifyJwt<{ id: string }>(
    accessToken,
    process.env.JWT_ACCESS_TOKEN_SECRET,
  )
  const user = await db.user.findUnique({ where: { id } })
  if (!user) return next(createHttpError(StatusCodes.UNAUTHORIZED, UNAUTHORIZED))
  if (user.status !== 'ACTIVE') {
    return next(createHttpError(StatusCodes.UNAUTHORIZED, UNAUTHORIZED))
  }
  res.locals.user = user
  next()
})
