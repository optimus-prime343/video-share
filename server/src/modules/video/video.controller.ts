import { createReadStream } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'

import type { User, VideoCategory } from '@prisma/client'
import expressAsyncHandler from 'express-async-handler'
import createHttpError from 'http-errors'
import { StatusCodes } from 'http-status-codes'

import { db } from '../../core/lib/prisma.js'
import { sendSuccessResponse } from '../../core/utils/response.js'
import { uploadFile } from '../../core/utils/upload.js'
import type {
  CreateVideoRequest,
  GetSuggestedVideosQuery,
  GetVideoDetailsParams,
  GetVideosQuery,
  WatchVideoParams,
} from './video.schema.js'

// check whether the category already exists and create it if it doesn't
const createVideoCategoryIfNotExists = async (category: string): Promise<VideoCategory> => {
  const videoCategoryExists = await db.videoCategory.findFirst({
    where: {
      name: category,
    },
  })
  if (videoCategoryExists) return videoCategoryExists
  return db.videoCategory.create({
    data: {
      name: category,
    },
  })
}

export const getVideos = expressAsyncHandler(async (req, res, _next) => {
  const count = await db.video.count({
    where: {
      status: 'APPROVED',
    },
  })
  const { page, perPage } = req.query as unknown as GetVideosQuery
  const skip = (page - 1) * perPage
  const totalPages = Math.ceil(count / perPage)
  const nextPage = page < totalPages ? page + 1 : null
  const prevPage = page > 1 ? page - 1 : null
  const videos = await db.video.findMany({
    where: {
      status: 'APPROVED',
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
    message: 'Videos fetched successfully.',
    data: {
      videos,
      nextPage,
      prevPage,
      totalPages,
    },
  })
})

export const getVideoDetails = expressAsyncHandler(async (req, res, _next) => {
  const { videoId } = req.params as GetVideoDetailsParams
  const video = await db.video.findFirst({
    where: {
      id: videoId,
      status: 'APPROVED',
    },
    include: {
      channel: true,
      category: true,
    },
  })
  sendSuccessResponse({
    res,
    message: 'Video fetched successfully.',
    data: video,
  })
})

export const getSuggestedVideos = expressAsyncHandler(async (req, res, _next) => {
  const { page, perPage, videoId, categoryId } =
    req.query as unknown as GetSuggestedVideosQuery
  const count = await db.video.count({
    where: {
      id: {
        not: videoId,
      },
      status: 'APPROVED',
      categoryId,
    },
  })
  const totalPages = Math.ceil(count / perPage)
  const skip = (page - 1) * perPage
  const nextPage = page < totalPages ? page + 1 : null
  const prevPage = page > 1 ? page - 1 : null
  const videos = await db.video.findMany({
    where: {
      id: {
        not: videoId,
      },
      status: 'APPROVED',
      categoryId,
    },
    skip,
    take: perPage,
  })
  sendSuccessResponse({
    res,
    message: 'Suggested videos fetched successfully.',
    data: {
      videos,
      nextPage,
      prevPage,
      totalPages,
    },
  })
})

export const create = expressAsyncHandler(async (req, res, next) => {
  const user = res.locals.user as User
  const channel = await db.channel.findUnique({
    where: {
      userId: user.id,
    },
  })
  if (!channel) {
    return next(createHttpError(StatusCodes.BAD_REQUEST, 'You have not created a channel yet'))
  }
  const { body, files } = req as unknown as CreateVideoRequest
  const { title, description, category } = body
  const videoFile = files.video[0]
  const thumbnailFile = files.thumbnail?.[0]

  const uploadVideoUrl = await uploadFile(videoFile, 'videos')

  const thumbnail = await uploadFile(thumbnailFile, 'thumbnails')

  const videoCategory = await createVideoCategoryIfNotExists(category)

  const video = await db.video.create({
    data: {
      title,
      description,
      thumbnail,
      categoryId: videoCategory.id,
      url: uploadVideoUrl as string,
      channelId: channel.id,
    },
    include: {
      channel: true,
      category: true,
    },
  })
  sendSuccessResponse({
    res,
    message: 'Video uploaded successfully.',
    data: video,
  })
})

export const watch = expressAsyncHandler(async (req, res, next) => {
  const { videoId } = req.params as WatchVideoParams
  const video = await db.video.findUnique({
    where: {
      id: videoId,
    },
  })
  if (!video) return next(createHttpError(StatusCodes.NOT_FOUND, 'Video not found'))
  const videoUrl = path.join(process.cwd(), 'public', video.url)
  const { size } = await fs.stat(videoUrl)
  const chunkSize = 10 ** 6
  const rangeStart = req.headers.range ?? 'bytes=0-'
  const start = parseInt(rangeStart.replace(/\D/g, ''))
  const end = Math.min(start + chunkSize, size - 1)

  const contentLength = end - start + 1
  const headers = {
    'Content-Range': `bytes ${start}-${end}/${size}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': 'video/mp4',
  }
  res.writeHead(StatusCodes.PARTIAL_CONTENT, headers)
  const videoStream = createReadStream(videoUrl, { start, end })
  videoStream.pipe(res)
})
