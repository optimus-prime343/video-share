import { Router } from 'express'

import { authRequired } from '../../core/middlewares/auth-required.js'
import { validateResource } from '../../core/middlewares/validate-resource.js'
import {
  createComment,
  deleteComment,
  getCommentsByVideo,
  updateComment,
} from './comment.controller.js'
import { GetCommentsByVideoSchema } from './comment.schema.js'

const commentRouter = Router()

commentRouter.get(
  '/video/:videoId',
  validateResource(GetCommentsByVideoSchema),
  getCommentsByVideo,
)

commentRouter.use(authRequired)
commentRouter.post('/', createComment)
commentRouter.patch('/:commentId', updateComment)
commentRouter.delete('/:commentId', deleteComment)

export { commentRouter }
