import type { User } from '@prisma/client'
import expressAsyncHandler from 'express-async-handler'

import { db } from '../../core/lib/prisma.js'
import { sendSuccessResponse } from '../../core/utils/response.js'
import type { CreateCommentRequest, GetCommentsByVideoRequest } from './comment.schema.js'

export const getCommentsByVideo = expressAsyncHandler(async (req, res, _next) => {
  const {
    params: { videoId },
    query: { page, perPage },
  } = req as unknown as GetCommentsByVideoRequest
  const count = await db.comment.count({
    where: {
      videoId,
    },
  })
  const totalPages = Math.ceil(count / perPage)
  const skip = (page - 1) * perPage
  const nextPage = page < totalPages ? page + 1 : null
  const prevPage = page > 1 ? page - 1 : null
  const comments = await db.comment.findMany({
    where: {
      videoId,
    },
    skip,
    take: perPage,
  })
  sendSuccessResponse({
    res,
    message: 'Comments fetched successfully',
    data: {
      comments,
      nextPage,
      prevPage,
      totalPages,
    },
  })
})
export const createComment = expressAsyncHandler(async (req, res, _next) => {
  const {
    body: { text, videoId },
  } = req as CreateCommentRequest
  const user = res.locals.user as User
  const comment = await db.comment.create({
    data: {
      text,
      userId: user.id,
      videoId: videoId,
    },
  })
  sendSuccessResponse({
    res,
    message: 'Comment created successfully',
    data: comment,
  })
})
