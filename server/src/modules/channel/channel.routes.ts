import { Router } from 'express'
import multer from 'multer'

import { AVATAR_IMAGE_FIELD, THUMBNAIL_IMAGE_FIELD } from '../../core/constants/strings.js'
import { authRequired } from '../../core/middlewares/auth-required.js'
import { validateResource } from '../../core/middlewares/validate-resource.js'
import { imageFileFilter } from '../../core/utils/file-filters.js'
import { fileDiskStorage } from '../../core/utils/file-storage.js'
import { createChannel, getChannelSubscribers, getUserChannel } from './channel.controller.js'
import { CreateChannelSchema } from './channel.schema.js'

const channelRouter = Router()

channelRouter.get('/subscribers/:channelId', getChannelSubscribers)

channelRouter.use(authRequired)

channelRouter.get('/get-user-channel', getUserChannel)
channelRouter.post(
  '/',
  multer({ storage: fileDiskStorage, fileFilter: imageFileFilter }).fields([
    { name: THUMBNAIL_IMAGE_FIELD, maxCount: 1 },
    { name: AVATAR_IMAGE_FIELD, maxCount: 1 },
  ]),
  validateResource(CreateChannelSchema),
  createChannel,
)

export { channelRouter }
