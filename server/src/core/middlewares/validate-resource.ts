import type { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import type { ZodTypeAny } from 'zod'

import { sendErrorResponse } from '../utils/response.js'

export const validateResource = (schema: ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
        files: req.files,
        file: req.file,
      })
      req.body = data.body
      req.query = data.query
      req.params = data.params
      req.files = data.files
      req.file = data.file
      next()
    } catch (error: any) {
      sendErrorResponse({
        res,
        statusCodes: StatusCodes.BAD_REQUEST,
        message: error,
      })
    }
  }
}
