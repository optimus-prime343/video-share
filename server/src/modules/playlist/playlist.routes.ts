import { Router } from 'express'

import { authRequired } from '../../core/middlewares/auth-required.js'
import { validateResource } from '../../core/middlewares/validate-resource.js'
import {
  addRemoveVideoFromPlaylist,
  create,
  getPlaylistIdsByVideo,
  read,
} from './playlist.controller.js'
import {
  AddRemoveVideoFromPlaylistRequestSchema,
  CreatePlaylistRequestSchema,
} from './playlist.schema.js'

const playListRouter = Router()

playListRouter.use(authRequired)

playListRouter.get('/', read)
playListRouter.get('/by-video/:videoId', getPlaylistIdsByVideo)
playListRouter.post('/', validateResource(CreatePlaylistRequestSchema), create)
playListRouter.post(
  '/add-remove-video-from-playlist',
  validateResource(AddRemoveVideoFromPlaylistRequestSchema),
  addRemoveVideoFromPlaylist,
)

export { playListRouter }
