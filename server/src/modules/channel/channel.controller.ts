import type { User } from '@prisma/client'
import expressAsyncHandler from 'express-async-handler'
import createHttpError from 'http-errors'
import { StatusCodes } from 'http-status-codes'

import { db } from '../../core/lib/prisma.js'
import { sendSuccessResponse } from '../../core/utils/response.js'
import { uploadFile } from '../../core/utils/upload.js'
import type {
  ChannelIdAsParamRequest,
  CreateChannelRequest,
  GetChannelVideosRequest,
  UpdateChannelRequest,
} from './channel.schema.js'

export const createChannel = expressAsyncHandler(async (req, res, next) => {
  const user = res.locals.user as User
  const { body, files } = req as unknown as CreateChannelRequest
  // check whether the channel name is already taken
  const existingChannel = await db.channel.findUnique({
    where: {
      name: body.name,
    },
  })
  if (existingChannel) {
    return next(createHttpError(StatusCodes.BAD_REQUEST, 'Channel name already taken'))
  }
  // check whether the user has already created a channel
  const existingUserChannel = await db.channel.findFirst({
    where: {
      userId: user.id,
    },
  })
  if (existingUserChannel) {
    return next(createHttpError(StatusCodes.BAD_REQUEST, 'You have already created a channel'))
  }
  const [thumbnail, avatar] = await Promise.all([
    uploadFile({
      path: files.thumbnail[0].path,
      folder: 'thumbnails',
      userId: user.id,
    }),
    uploadFile({
      path: files.avatar[0].path,
      folder: 'avatars',
      userId: user.id,
    }),
  ])

  const newChannel = await db.channel.create({
    data: {
      name: body.name,
      description: body.description,
      thumbnail,
      avatar,
      userId: user.id,
    },
  })
  sendSuccessResponse({
    res,
    message: 'Channel created successfully',
    data: newChannel,
  })
})

export const updateChannel = expressAsyncHandler(async (req, res, next) => {
  const user = res.locals.user as User
  const {
    body,
    files,
    params: { id },
  } = req as unknown as UpdateChannelRequest
  const channelExists = await db.channel.findFirst({
    where: {
      id,
      userId: user.id,
    },
  })
  if (!channelExists) return next(createHttpError(StatusCodes.NOT_FOUND, 'Channel not found'))

  const thumbnail = await uploadFile({
    path: files.thumbnail?.[0].path,
    folder: 'thumbnails',
    userId: user.id,
  })
  const avatar = await uploadFile({
    path: files.avatar?.[0].path,
    folder: 'avatars',
    userId: user.id,
  })
  const updatedChannel = await db.channel.update({
    where: {
      id,
    },
    data: {
      name: body.name,
      description: body.description,
      thumbnail,
      avatar,
    },
  })
  sendSuccessResponse({
    res,
    message: 'Channel updated successfully',
    data: updatedChannel,
  })
})

export const getUserChannel = expressAsyncHandler(async (_req, res, _next) => {
  const user = res.locals.user as User
  const userChannel = await db.channel.findUnique({ where: { userId: user.id } })
  sendSuccessResponse({
    res,
    message: 'User channel fetched successfully',
    data: userChannel,
  })
})

export const getChannelSubscribers = expressAsyncHandler(async (req, res) => {
  const { id } = req.params as ChannelIdAsParamRequest['params']
  const subscribers = await db.subscription.count({
    where: {
      id,
    },
  })
  sendSuccessResponse({
    res,
    data: {
      subscribers,
    },
  })
})
export const getChannelDetails = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params as ChannelIdAsParamRequest['params']
  const channel = await db.channel.findUnique({
    where: {
      id,
    },
  })
  if (!channel) return next(createHttpError(StatusCodes.NOT_FOUND, 'Channel not found'))
  const totalSubscribers = await db.subscription.count({
    where: {
      channelId: id,
    },
  })
  const totalViews = await db.video.aggregate({
    where: {
      channelId: id,
    },
    _sum: {
      views: true,
    },
  })
  const channelDetails = {
    ...channel,
    totalSubscribers,
    totalViews: totalViews._sum?.views ?? 0,
  }
  sendSuccessResponse({
    res,
    message: 'Channel details fetched successfully',
    data: channelDetails,
  })
})

export const getChannelVideos = expressAsyncHandler(async (req, res, next) => {
  const {
    params: { id },
    query: { perPage, page },
  } = req as unknown as GetChannelVideosRequest
  const channel = await db.channel.findUnique({
    where: {
      id,
    },
  })
  if (!channel) return next(createHttpError(StatusCodes.NOT_FOUND, 'Channel not found'))
  const videosCount = await db.video.count({
    where: {
      channelId: id,
    },
  })
  const totalPages = Math.ceil(videosCount / perPage)
  const nextPage = page < totalPages ? page + 1 : null
  const prevPage = page > 1 ? page - 1 : null
  const skip = (page - 1) * perPage
  const videos = await db.video.findMany({
    where: {
      channelId: id,
    },
    include: {
      channel: true,
      category: true,
    },
    skip,
    take: perPage,
  })
  sendSuccessResponse({
    res,
    message: 'Channel videos fetched successfully',
    data: {
      videos,
      nextPage,
      prevPage,
      totalPages,
    },
  })
})
