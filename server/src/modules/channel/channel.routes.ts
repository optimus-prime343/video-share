import { Router } from 'express'
import multer from 'multer'

import { AVATAR_IMAGE_FIELD, THUMBNAIL_IMAGE_FIELD } from '../../core/constants/strings.js'
import { authRequired } from '../../core/middlewares/auth-required.js'
import { validateResource } from '../../core/middlewares/validate-resource.js'
import { imageFileFilter } from '../../core/utils/file-filters.js'
import { fileDiskStorage } from '../../core/utils/file-storage.js'
import {
  createChannel,
  getChannelDetails,
  getChannelSubscribers,
  getChannelVideos,
  getUserChannel,
  updateChannel,
} from './channel.controller.js'
import {
  ChannelIdAsParamRequestSchema,
  CreateChannelSchema,
  GetChannelVideosSchema,
  UpdateChannelSchema,
} from './channel.schema.js'

const channelRouter = Router()

channelRouter.get(
  '/subscribers/:id',
  validateResource(ChannelIdAsParamRequestSchema),
  getChannelSubscribers,
)
channelRouter.get('/videos/:id', validateResource(GetChannelVideosSchema), getChannelVideos)

channelRouter.use(authRequired)

channelRouter.get('/get-user-channel', getUserChannel)
channelRouter.get('/:id', getChannelDetails)
channelRouter.post(
  '/',
  multer({ storage: fileDiskStorage, fileFilter: imageFileFilter }).fields([
    { name: THUMBNAIL_IMAGE_FIELD, maxCount: 1 },
    { name: AVATAR_IMAGE_FIELD, maxCount: 1 },
  ]),
  validateResource(CreateChannelSchema),
  createChannel,
)
channelRouter.patch(
  '/:id',
  multer({ storage: fileDiskStorage, fileFilter: imageFileFilter }).fields([
    { name: THUMBNAIL_IMAGE_FIELD, maxCount: 1 },
    { name: AVATAR_IMAGE_FIELD, maxCount: 1 },
  ]),
  validateResource(UpdateChannelSchema),
  updateChannel,
)

export { channelRouter }
