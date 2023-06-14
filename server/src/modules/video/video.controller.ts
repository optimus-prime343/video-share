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
  LikeDislikeVideoQuery,
  UpdateViewCountQuery,
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
  const { page, perPage, category, search } = req.query as unknown as GetVideosQuery
  const skip = (page - 1) * perPage
  const totalPages = Math.ceil(count / perPage)
  const nextPage = page < totalPages ? page + 1 : null
  const prevPage = page > 1 ? page - 1 : null
  const videos = await db.video.findMany({
    where: {
      status: 'APPROVED',
      title: {
        contains: search,
        mode: 'insensitive',
      },
      category: {
        name: category,
      },
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
    include: {
      channel: true,
      category: true,
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

export const createVideo = expressAsyncHandler(async (req, res, next) => {
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

export const updateViewCount = expressAsyncHandler(async (req, res, next) => {
  const { videoId } = req.query as UpdateViewCountQuery
  const videoExists = await db.video.findUnique({ where: { id: videoId } })
  if (!videoExists) {
    return next(createHttpError(StatusCodes.NOT_FOUND, 'Video not found'))
  }
  await db.video.update({
    where: {
      id: videoId,
    },
    data: {
      views: {
        increment: 1,
      },
    },
  })
  sendSuccessResponse({
    res,
    message: 'View count updated successfully.',
  })
})

export const likeVideo = expressAsyncHandler(async (req, res, _next) => {
  const user = res.locals.user as User
  const { videoId } = req.query as LikeDislikeVideoQuery
  const alreadyDislikedVideo = await db.dislikedVideo.findFirst({
    where: {
      userId: user.id,
      videoId,
    },
    include: {
      video: true,
    },
  })
  if (alreadyDislikedVideo) {
    await db.dislikedVideo.delete({
      where: {
        id: alreadyDislikedVideo.id,
      },
    })
    await db.video.update({
      where: {
        id: videoId,
      },
      data: {
        dislikes: {
          decrement: alreadyDislikedVideo.video.dislikes > 0 ? 1 : 0,
        },
      },
    })
  }
  const alreadyLikedVideo = await db.likedVideo.findFirst({
    where: {
      userId: user.id,
      videoId,
    },
    include: {
      video: true,
    },
  })
  if (alreadyLikedVideo) {
    await db.likedVideo.delete({
      where: {
        id: alreadyLikedVideo.id,
      },
    })
    await db.video.update({
      where: {
        id: videoId,
      },
      data: {
        likes: {
          decrement: alreadyLikedVideo.video.likes > 0 ? 1 : 0,
        },
      },
    })
    return sendSuccessResponse({
      res,
      message: 'Video unliked successfully.',
    })
  }
  await db.likedVideo.create({
    data: {
      userId: user.id,
      videoId,
    },
  })
  await db.video.update({
    where: {
      id: videoId,
    },
    data: {
      likes: {
        increment: 1,
      },
    },
  })
  sendSuccessResponse({
    res,
    message: 'Video liked successfully.',
  })
})

export const videoLikedStatus = expressAsyncHandler(async (req, res, _next) => {
  const user = res.locals.user as User
  const { videoId } = req.query as LikeDislikeVideoQuery
  const hasAlreadyLiked = await db.likedVideo.findFirst({
    where: {
      userId: user.id,
      videoId,
    },
  })
  sendSuccessResponse({
    res,
    message: 'Video liked status fetched successfully.',
    data: {
      isLiked: !!hasAlreadyLiked,
    },
  })
})

export const dislikeVideo = expressAsyncHandler(async (req, res, _next) => {
  const user = res.locals.user as User
  const { videoId } = req.query as LikeDislikeVideoQuery
  const alreadyLikedVideo = await db.likedVideo.findFirst({
    where: {
      userId: user.id,
      videoId,
    },
    include: {
      video: true,
    },
  })
  if (alreadyLikedVideo) {
    await db.likedVideo.delete({
      where: {
        id: alreadyLikedVideo.id,
      },
    })
    await db.video.update({
      where: {
        id: videoId,
      },
      data: {
        likes: {
          decrement: alreadyLikedVideo.video.likes > 0 ? 1 : 0,
        },
      },
    })
  }
  const alreadyDislikedVideo = await db.dislikedVideo.findFirst({
    where: {
      userId: user.id,
      videoId,
    },
    include: {
      video: true,
    },
  })
  if (alreadyDislikedVideo) {
    await db.dislikedVideo.delete({
      where: {
        id: alreadyDislikedVideo.id,
      },
    })
    await db.video.update({
      where: {
        id: videoId,
      },
      data: {
        dislikes: {
          decrement: alreadyDislikedVideo.video.dislikes > 0 ? 1 : 0,
        },
      },
    })
    return sendSuccessResponse({
      res,
      message: 'Video undisliked successfully.',
    })
  }
  await db.dislikedVideo.create({
    data: {
      userId: user.id,
      videoId,
    },
  })
  await db.video.update({
    where: {
      id: videoId,
    },
    data: {
      dislikes: {
        increment: 1,
      },
    },
  })
  sendSuccessResponse({
    res,
    message: 'Video disliked successfully.',
  })
})

export const videoDislikedStatus = expressAsyncHandler(async (req, res, _next) => {
  const user = res.locals.user as User
  const { videoId } = req.query as LikeDislikeVideoQuery
  const hasAlreadyDisliked = await db.dislikedVideo.findFirst({
    where: {
      userId: user.id,
      videoId,
    },
  })
  sendSuccessResponse({
    res,
    data: {
      isDisliked: !!hasAlreadyDisliked,
    },
  })
})

export const getVideoCategories = expressAsyncHandler(async (_req, res, _next) => {
  const categories = await db.videoCategory.findMany()
  sendSuccessResponse({
    res,
    data: categories,
  })
})
