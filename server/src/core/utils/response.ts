import type { Response } from 'express'
import { getReasonPhrase, StatusCodes } from 'http-status-codes'

export interface SuccessResponseParams<T> {
  res: Response
  statusCodes?: StatusCodes
  message?: string
  data?: Awaited<T>
}
export interface ErrorResponseParams {
  res: Response
  statusCodes?: StatusCodes
  message?: string
  stack?: string
}

export const sendSuccessResponse = <T>({
  res,
  statusCodes,
  message,
  data,
}: SuccessResponseParams<T>): void => {
  res.status(statusCodes ?? StatusCodes.OK).json({
    message,
    data,
  })
}
export const sendErrorResponse = ({
  res,
  message,
  statusCodes,
  stack,
}: ErrorResponseParams): void => {
  res.status(statusCodes ?? StatusCodes.INTERNAL_SERVER_ERROR).json({
    message: message ?? getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
    stack: process.env.NODE_ENV === 'production' ? undefined : stack,
  })
}
