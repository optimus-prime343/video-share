import { Router } from 'express'

import { authRequired } from '../../core/middlewares/auth-required.js'
import { validateResource } from '../../core/middlewares/validate-resource.js'
import { create, read } from './history.controllers.js'
import { CreateHistoryRequestSchema, GetHistoryRequestSchema } from './history.schemas.js'

const historyRouter = Router()

historyRouter.use(authRequired)

historyRouter.get('/', validateResource(GetHistoryRequestSchema), read)
historyRouter.post('/', validateResource(CreateHistoryRequestSchema), create)

export { historyRouter }
