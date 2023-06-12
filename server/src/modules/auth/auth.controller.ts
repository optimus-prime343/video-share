import crypto from 'node:crypto'

import argon2 from 'argon2'
import type { CookieOptions } from 'express'
import expressAsyncHandler from 'express-async-handler'
import createHttpError from 'http-errors'
import { StatusCodes } from 'http-status-codes'
import jsonwebtoken from 'jsonwebtoken'

import { VERIFICATION_TOKEN_EXPIRES_IN_MS } from '../../core/constants/numbers.js'
import {
  ACCESS_TOKEN_NAME,
  REFRESH_TOKEN_NAME,
  UNAUTHORIZED,
} from '../../core/constants/strings.js'
import { signJWT, verifyJwt } from '../../core/lib/jsonwebtoken.js'
import { sendMail } from '../../core/lib/nodemailer.js'
import { db } from '../../core/lib/prisma.js'
import { sendErrorResponse, sendSuccessResponse } from '../../core/utils/response.js'
import type {
  CreateAccountPayload,
  LoginPayload,
  VerifyAccountPayload,
} from './auth.schema.js'

const createAccount = expressAsyncHandler(async (req, res, next) => {
  const { email, password } = req.body as CreateAccountPayload
  const user = await db.user.findUnique({ where: { email } })
  if (user)
    return next(createHttpError(StatusCodes.BAD_REQUEST, 'Email address already exists'))
  const verificationToken = crypto.randomBytes(32).toString('hex')
  const verificationTokenExpiresAt = new Date(Date.now() + VERIFICATION_TOKEN_EXPIRES_IN_MS)
  const hashedPassword = await argon2.hash(password)
  const newUser = await db.user.create({
    data: { email, password: hashedPassword },
  })
  await db.verificationToken.create({
    data: {
      token: verificationToken,
      expiresAt: verificationTokenExpiresAt,
      userId: newUser.id,
    },
  })
  const verificationLink = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/auth/verify-account/${verificationToken}`
  await sendMail({
    to: email,
    subject: 'Verify your email address',
    html: `
      <h1>Verify your email address</h1>
      <p>Click the link below to verify your email address.</p>
      <a href="${verificationLink}">Verify your account</a>
    `,
  })
  sendSuccessResponse({
    res,
    message: 'Please check your email for verification details.',
  })
})
const verifyAccount = expressAsyncHandler(async (req, res, next) => {
  const { verificationToken: verificationTokenString } = req.params as VerifyAccountPayload
  const verificationToken = await db.verificationToken.findFirst({
    where: {
      token: verificationTokenString,
      expiresAt: {
        gt: new Date(),
      },
    },
  })
  if (!verificationToken) {
    return next(createHttpError(StatusCodes.BAD_REQUEST, 'Invalid verification token'))
  }

  const hasVerificationTokenExpired = verificationToken.expiresAt < new Date()
  if (hasVerificationTokenExpired) {
    return next(
      createHttpError(
        StatusCodes.BAD_REQUEST,
        'Verification token has expired.Please request a new verification token',
      ),
    )
  }
  const user = await db.user.findUnique({
    where: {
      id: verificationToken.userId,
    },
  })
  if (!user) {
    return next(createHttpError(StatusCodes.BAD_REQUEST, 'Invalid verification token'))
  }

  await db.user.update({
    where: { id: user.id },
    data: { status: 'ACTIVE' },
  })
  await db.verificationToken.delete({
    where: { id: verificationToken.id },
  })

  sendSuccessResponse({
    res,
    message: 'Your account has been verified successfully.',
  })
})
const login = expressAsyncHandler(async (req, res, next) => {
  const { email, password } = req.body as LoginPayload
  const user = await db.user.findUnique({ where: { email } })
  if (!user) return next(createHttpError(StatusCodes.BAD_REQUEST, 'Invalid email or password'))
  if (user.status !== 'ACTIVE')
    return next(
      createHttpError(StatusCodes.BAD_REQUEST, 'Please verify your account before login.'),
    )
  const isPasswordMatch = await argon2.verify(user.password, password)
  if (!isPasswordMatch)
    return next(createHttpError(StatusCodes.BAD_REQUEST, 'Invalid email or password'))
  const payload = { id: user.id, sub: user.email }
  const accessToken = await signJWT(payload, process.env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
  })
  const refreshToken = await signJWT(payload, process.env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
  })
  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  }
  res.cookie(ACCESS_TOKEN_NAME, accessToken, cookieOptions)
  res.cookie(REFRESH_TOKEN_NAME, refreshToken, cookieOptions)
  await db.session.create({ data: { refreshToken, userId: user.id } })
  sendSuccessResponse({
    res,
    message: 'You have been logged in successfully.',
  })
})

const profile = expressAsyncHandler(async (req, res, _next) => {
  const accessToken = req.cookies?.[ACCESS_TOKEN_NAME] as string | undefined
  const refreshToken = req.cookies?.[REFRESH_TOKEN_NAME] as string | undefined
  // if accessToken and refreshToken are not present in cookies, return null user
  console.log({ accessToken, refreshToken })
  if (!accessToken || !refreshToken) {
    return sendSuccessResponse({
      res,
      data: {
        user: null,
      },
    })
  }

  await verifyJwt(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET)
    .then(async () => {
      await verifyJwt<{ id: string }>(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET)
        .then(async ({ id }) => {
          const user = await db.user.findUnique({
            where: {
              id,
            },
            select: {
              id: true,
              email: true,
              status: true,
              createdAt: true,
              updatedAt: true,
              role: true,
            },
          })
          return sendSuccessResponse({
            res,
            message: 'User profile fetched successfully.',
            data: {
              user,
            },
          })
        })
        .catch(error => {
          if (error instanceof jsonwebtoken.TokenExpiredError) {
            return sendErrorResponse({
              res,
              message: error.message,
              stack: error.stack,
              meta: {
                code: 'ACCESS_TOKEN_EXPIRED',
              },
            })
          }
        })
    })
    .catch(error => {
      console.log('edasdasdas', error.message)
      if (error instanceof jsonwebtoken.TokenExpiredError) {
        // if refreshToken is expired, clear both the accessToken and the refreshToken from the client
        res.clearCookie(ACCESS_TOKEN_NAME)
        res.clearCookie(REFRESH_TOKEN_NAME)
        return sendSuccessResponse({
          res,
          data: {
            user: null,
          },
        })
      }
    })
  sendSuccessResponse({
    res,
    data: {
      user: null,
    },
  })
})

const refreshToken = expressAsyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies[REFRESH_TOKEN_NAME]
  if (!refreshToken) return next(createHttpError(StatusCodes.UNAUTHORIZED, UNAUTHORIZED))
  await verifyJwt(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET)
  const session = await db.session.findUnique({
    where: { refreshToken },
    include: { user: true },
  })
  if (!session) return next(createHttpError(StatusCodes.UNAUTHORIZED, UNAUTHORIZED))
  const payload = { id: session.userId, sub: session.user.email }
  const accessToken = await signJWT(payload, process.env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
  })
  const newRefreshToken = await signJWT(payload, process.env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
  })
  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  }
  res.cookie(ACCESS_TOKEN_NAME, accessToken, cookieOptions)
  res.cookie(REFRESH_TOKEN_NAME, newRefreshToken, cookieOptions)
  await db.session.update({
    where: { id: session.id },
    data: { refreshToken: newRefreshToken },
  })
  sendSuccessResponse({
    res,
    message: 'Token refreshed successfully.',
  })
})

export { createAccount, login, profile, refreshToken, verifyAccount }
