import type { User } from '@prisma/client'
import expressAsyncHandler from 'express-async-handler'
import createHttpError from 'http-errors'
import { StatusCodes } from 'http-status-codes'

import { db } from '../../core/lib/prisma.js'
import { sendSuccessResponse } from '../../core/utils/response.js'
import type {
  AddRemoveVideoFromPlaylistRequest,
  CreatePlaylistRequest,
  GetPlaylistIdsByVideoRequest,
} from './playlist.schema.js'

export const read = expressAsyncHandler(async (req, res) => {
  const playlists = await db.playlist.findMany({
    where: {
      userId: res.locals.user.id,
    },
  })
  sendSuccessResponse({
    res,
    data: playlists,
  })
})
export const create = expressAsyncHandler(async (req, res) => {
  const user = res.locals.user as User
  const { name, description } = req.body as CreatePlaylistRequest['body']
  const playlist = await db.playlist.create({
    data: {
      name,
      description,
      userId: user.id,
    },
  })
  sendSuccessResponse({
    res,
    message: 'Playlist created successfully',
    data: playlist,
  })
})

export const addRemoveVideoFromPlaylist = expressAsyncHandler(async (req, res, next) => {
  const { playlistId, videoId } = req.body as AddRemoveVideoFromPlaylistRequest['body']
  const playlist = await db.playlist.findUnique({
    where: {
      id: playlistId,
    },
  })
  if (!playlist) return next(createHttpError(StatusCodes.NOT_FOUND, 'Playlist not found'))

  const video = await db.video.findUnique({
    where: {
      id: videoId,
    },
  })
  if (!video) return next(createHttpError(StatusCodes.NOT_FOUND, 'Video not found'))

  const isVideoAlreadyOnPlaylist = await db.video.findFirst({
    where: {
      id: videoId,
      playlists: {
        some: {
          id: playlistId,
        },
      },
    },
  })
  if (isVideoAlreadyOnPlaylist) {
    await db.playlist.update({
      where: {
        id: playlistId,
      },
      data: {
        videos: {
          disconnect: {
            id: videoId,
          },
        },
      },
    })
    return sendSuccessResponse({
      res,
      message: 'Video removed from playlist successfully',
    })
  }
  await db.playlist.update({
    where: {
      id: playlistId,
    },
    data: {
      videos: {
        connect: {
          id: videoId,
        },
      },
    },
  })
  return sendSuccessResponse({
    res,
    message: 'Video added to playlist successfully',
  })
})

export const getPlaylistIdsByVideo = expressAsyncHandler(async (req, res, next) => {
  const { videoId } = req.params as GetPlaylistIdsByVideoRequest['params']
  const video = await db.video.findUnique({
    where: {
      id: videoId,
    },
  })
  if (!video) return next(createHttpError(StatusCodes.NOT_FOUND, 'Video not found'))
  const playlistByVideo = await db.playlist.findMany({
    where: {
      videos: {
        some: {
          id: videoId,
        },
      },
    },
    select: {
      id: true,
    },
  })
  const playlistIdsByVideo = playlistByVideo.map(playlist => playlist.id)
  sendSuccessResponse({
    res,
    data: playlistIdsByVideo,
  })
})
