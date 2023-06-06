import { Router } from 'express'
import multer from 'multer'

import { VIDEO_FIELD } from '../../core/constants/strings.js'
import { authRequired } from '../../core/middlewares/auth-required.js'
import { validateResource } from '../../core/middlewares/validate-resource.js'
import { videoFileFilter } from '../../core/utils/file.js'
import { create, renderVideoPlayer, watch } from './video.controller.js'
import { CreateVideoSchema } from './video.schema.js'

const videoRouter = Router()

videoRouter.get('/render-video-player/:videoId', renderVideoPlayer) //! FOR TESTING ONLY
videoRouter.get('/watch/:videoId', watch)

videoRouter.use(authRequired)

videoRouter.post(
  '/',
  multer({ fileFilter: videoFileFilter }).single(VIDEO_FIELD),
  validateResource(CreateVideoSchema),
  create,
)

export { videoRouter }
