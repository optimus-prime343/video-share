import { Router } from 'express'

import { authRequired } from '../../core/middlewares/auth-required.js'
import { validateResource } from '../../core/middlewares/validate-resource.js'
import { createComment, getCommentsByVideo } from './comment.controller.js'
import { GetCommentsByVideoSchema } from './comment.schema.js'

const commentRouter = Router()

commentRouter.get(
  '/video/:videoId',
  validateResource(GetCommentsByVideoSchema),
  getCommentsByVideo,
)

commentRouter.use(authRequired)
commentRouter.post('/', createComment)

export { commentRouter }
