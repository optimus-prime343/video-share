import { Router } from 'express'

import { authRequired } from '../../core/middlewares/auth-required.js'
import {
  checkSubscriptionStatus,
  getSubscriptions,
  subscribe,
  unsubscribe,
} from './subscription.controller.js'

const subscriptionRouter = Router()

subscriptionRouter.use(authRequired)

subscriptionRouter.get('/', getSubscriptions) // get all subscriptions
subscriptionRouter.get('/status/:channelId', checkSubscriptionStatus) // check if user is subscribed to a channel
subscriptionRouter.post('/subscribe/:channelId', subscribe) // subscribe
subscriptionRouter.delete('/unsubscribe/:channelId', unsubscribe) // unsubscribe

export { subscriptionRouter }
