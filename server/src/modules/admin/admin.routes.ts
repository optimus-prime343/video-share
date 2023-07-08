import { Router } from 'express'

import { authRequired } from '../../core/middlewares/auth-required.js'
import { restrictTo } from '../../core/middlewares/restrict-to.js'
import { adminVideosRouter } from './videos/admin-videos.routes.js'

const adminRouter = Router()

adminRouter.use(authRequired, restrictTo('ADMIN'))
adminRouter.use('/videos', adminVideosRouter)

export { adminRouter }
