import type { User } from '@prisma/client'
import expressAsyncHandler from 'express-async-handler'
import createHttpError from 'http-errors'
import { StatusCodes } from 'http-status-codes'

import { db } from '../../core/lib/prisma.js'
import { sendSuccessResponse } from '../../core/utils/response.js'
import type { CreateHistoryRequest, GetHistoryRequest } from './history.schemas.js'

export const read = expressAsyncHandler(async (req, res) => {
  const user = res.locals.user as User
  const { page, perPage } = req.query as unknown as GetHistoryRequest['query']
  const count = await db.history.count({
    where: {
      userId: user.id,
    },
  })
  const totalPages = Math.ceil(count / perPage)
  const skip = (page - 1) * perPage
  const nextPage = page < totalPages ? page + 1 : null
  const prevPage = page > 1 ? page - 1 : null
  const history = await db.history.findMany({
    where: { userId: user.id },
    skip,
    take: perPage,
    include: {
      video: {
        include: { channel: true, category: true },
      },
    },
  })
  sendSuccessResponse({
    res,
    message: 'History fetched successfully',
    data: {
      history,
      nextPage,
      prevPage,
      totalPages,
    },
  })
})

export const create = expressAsyncHandler(async (req, res, next) => {
  const user = res.locals.user as User
  const { videoId, timestamp } = req.body as CreateHistoryRequest['body']
  // check if history with same video, user and timestamp exists
  const history = await db.history.findFirst({
    where: {
      videoId,
      userId: user.id,
      timestamp,
    },
  })
  if (history) return next(createHttpError(StatusCodes.CONFLICT, 'History already exists'))
  // update the existing history if user and video are same but timestamp is different
  const existingHistory = await db.history.findFirst({
    where: {
      videoId,
      userId: user.id,
    },
  })
  if (existingHistory && existingHistory.timestamp !== timestamp) {
    const updatedHistory = await db.history.update({
      where: { id: existingHistory.id },
      data: { timestamp },
      include: { video: true },
    })
    return sendSuccessResponse({
      res,
      message: 'History updated successfully',
      data: updatedHistory,
    })
  }
  const newHistory = await db.history.create({
    data: { timestamp, videoId, userId: user.id },
    include: { video: true },
  })
  return sendSuccessResponse({
    res,
    message: 'History created successfully',
    data: newHistory,
  })
})
