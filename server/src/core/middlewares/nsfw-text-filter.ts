import type { NextFunction, Request, RequestHandler, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { inference } from '../lib/huggingface.js'
import { sendErrorResponse } from '../utils/response.js'

type GetTextFn = (req: Request) => unknown // Since we filter out the non string values in line 24, we can use unknown here

const checkTextForNsfw = async (text: string): Promise<boolean> => {
  const result = await inference.textClassification({
    model: 'michellejieli/NSFW_text_classifier',
    inputs: text,
  })
  const nsfwScore = result[0].score
  const sfwScore = result[1].score
  return nsfwScore > sfwScore
}

export const nsfwTextFilter =
  (getTextsFn: GetTextFn[]): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
    const texts = getTextsFn
      .map(getTextFn => getTextFn(req))
      .filter(item => typeof item === 'string')
      .filter(Boolean) as string[]
    if (texts.length === 0) return next()
    const result = await Promise.all(texts.map(checkTextForNsfw))
    const nsfwResults = result.filter(Boolean)
    if (nsfwResults.length > 0) {
      sendErrorResponse({
        res,
        message: "Please make sure you don't use any NSFW words in text",
        statusCodes: StatusCodes.BAD_REQUEST,
      })
      return
    }
    next()
  }
