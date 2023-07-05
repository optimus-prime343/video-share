import type { User } from '@prisma/client'
import expressAsyncHandler from 'express-async-handler'
import createHttpError from 'http-errors'
import { StatusCodes } from 'http-status-codes'

import { db } from '../../core/lib/prisma.js'
import { sendSuccessResponse } from '../../core/utils/response.js'
import type {
  CreateCommentRequest,
  DeleteCommentRequest,
  GetCommentsByVideoRequest,
  UpdateCommentRequest,
} from './comment.schema.js'

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
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          image: true,
        },
      },
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
      count,
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
    include: {
      user: {
        select: {
          id: true,
          username: true,
          image: true,
        },
      },
    },
  })
  sendSuccessResponse({
    res,
    message: 'Comment created successfully',
    data: comment,
  })
})

export const updateComment = expressAsyncHandler(async (req, res, next) => {
  const user = res.locals.user as User
  const { text } = req.body as UpdateCommentRequest['body']
  const { commentId } = req.params as UpdateCommentRequest['params']

  const comment = await db.comment.findFirst({
    where: {
      id: commentId,
      userId: user.id,
    },
  })
  if (!comment) return next(createHttpError(StatusCodes.NOT_FOUND, 'Comment not found'))
  const updatedComment = await db.comment.update({
    where: {
      id: comment.id,
    },
    data: {
      text,
    },
  })
  sendSuccessResponse({
    res,
    message: 'Comment updated successfully',
    data: updatedComment,
  })
})

export const deleteComment = expressAsyncHandler(async (req, res, next) => {
  const user = res.locals.user as User
  const { commentId } = req.params as DeleteCommentRequest['params']
  const comment = await db.comment.findFirst({
    where: {
      id: commentId,
      userId: user.id,
    },
  })
  if (!comment) return next(createHttpError(StatusCodes.NOT_FOUND, 'Comment not found'))
  await db.comment.delete({
    where: {
      id: comment.id,
    },
  })
  sendSuccessResponse({
    res,
    message: 'Comment deleted successfully',
  })
})
