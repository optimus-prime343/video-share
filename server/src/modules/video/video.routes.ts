import { Router } from 'express'
import multer from 'multer'

import { THUMBNAIL_IMAGE_FIELD, VIDEO_FIELD } from '../../core/constants/strings.js'
import { authRequired } from '../../core/middlewares/auth-required.js'
import { validateResource } from '../../core/middlewares/validate-resource.js'
import { imageOrVideoFileFilter } from '../../core/utils/file.js'
import {
  createVideo,
  dislikeVideo,
  getSuggestedVideos,
  getVideoCategories,
  getVideoDetails,
  getVideos,
  likeVideo,
  updateViewCount,
  videoDislikedStatus,
  videoLikedStatus,
  watch,
} from './video.controller.js'
import {
  CreateVideoSchema,
  GetSuggestedVideosSchema,
  GetVideoDetailsSchema,
  GetVideosSchema,
  LikeDislikeVideoSchema,
  UpdateViewCountSchema,
} from './video.schema.js'

const videoRouter = Router()

videoRouter.get('/watch/:videoId', watch)

videoRouter.get('/categories', getVideoCategories)
videoRouter.get(
  '/suggested-videos',
  validateResource(GetSuggestedVideosSchema),
  getSuggestedVideos, // This is one of the recommendation algorithm of all time
)
videoRouter.post(
  '/update-video-views',
  validateResource(UpdateViewCountSchema),
  updateViewCount,
) //! MAJOR FLAW HERE : REMOVE THIS API LATER AND UPDATE VIDEO ONLY WHEN USER WATCHES THE VIDEO

videoRouter.post(
  '/like-video',
  authRequired,
  validateResource(LikeDislikeVideoSchema),
  likeVideo,
)
videoRouter.get(
  '/is-video-liked',
  authRequired,
  validateResource(LikeDislikeVideoSchema),
  videoLikedStatus,
)
videoRouter.post(
  '/dislike-video',
  authRequired,
  validateResource(LikeDislikeVideoSchema),
  dislikeVideo,
)
videoRouter.get(
  '/is-video-disliked',
  authRequired,
  validateResource(LikeDislikeVideoSchema),
  videoDislikedStatus,
)
videoRouter.get('/', validateResource(GetVideosSchema), getVideos)
videoRouter.get('/:videoId', validateResource(GetVideoDetailsSchema), getVideoDetails)
videoRouter.post(
  '/',
  authRequired,
  multer({ fileFilter: imageOrVideoFileFilter }).fields([
    { name: VIDEO_FIELD, maxCount: 1 },
    { name: THUMBNAIL_IMAGE_FIELD, maxCount: 1 },
  ]),
  validateResource(CreateVideoSchema),
  createVideo,
)

export { videoRouter }
