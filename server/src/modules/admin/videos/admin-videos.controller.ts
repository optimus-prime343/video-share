import expressAsyncHandler from 'express-async-handler'

import { db } from '../../../core/lib/prisma.js'
import { sendSuccessResponse } from '../../../core/utils/response.js'
import type { GetVideosRequest, UpdateVideoRequest } from './admin-videos.schemas.js'

export const read = expressAsyncHandler(async (req, res, _next) => {
  const { page, perPage } = req.query as unknown as GetVideosRequest['query']
  const count = await db.video.count()
  const skip = (page - 1) * perPage
  const totalPages = Math.ceil(count / perPage)
  const nextPage = page < totalPages ? page + 1 : null
  const prevPage = page > 1 ? page - 1 : null
  const videos = await db.video.findMany({
    skip,
    take: perPage,
    include: {
      channel: true,
      category: true,
    },
  })
  sendSuccessResponse({
    res,
    data: {
      videos,
      nextPage,
      prevPage,
      totalPages,
    },
  })
})
export const update = expressAsyncHandler(async (req, res, _next) => {
  const {
    params: { id },
    body: { status },
  } = req as unknown as UpdateVideoRequest
  const video = await db.video.update({
    where: { id },
    data: {
      status,
    },
    include: {
      channel: true,
      category: true,
    },
  })
  sendSuccessResponse({
    res,
    message: 'Video updated successfully',
    data: video,
  })
})
