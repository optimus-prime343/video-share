import { Router } from 'express'

import { validateResource } from '../../../core/middlewares/validate-resource.js'
import { read, update } from './admin-videos.controller.js'
import { GetVideosRequestSchema, UpdateVideoRequestSchema } from './admin-videos.schemas.js'

const adminVideosRouter = Router()

adminVideosRouter.get('/', validateResource(GetVideosRequestSchema), read)
adminVideosRouter.patch('/:id', validateResource(UpdateVideoRequestSchema), update)

export { adminVideosRouter }
