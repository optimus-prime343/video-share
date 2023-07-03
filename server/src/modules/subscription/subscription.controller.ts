import type { User } from '@prisma/client'
import expressAsyncHandler from 'express-async-handler'
import createHttpError from 'http-errors'
import { StatusCodes } from 'http-status-codes'

import { db } from '../../core/lib/prisma.js'
import { sendSuccessResponse } from '../../core/utils/response.js'
import type {
  CheckSubscriptionStatusRequest,
  GetSubscriptionsRequest,
  SubscribeUnsubscribeRequest,
} from './subscription.schema.js'

const getSubscriptions = expressAsyncHandler(async (req, res) => {
  const user = res.locals.user as User
  const { page, perPage } = req.query as unknown as GetSubscriptionsRequest['query']
  const count = await db.subscription.count({
    where: {
      userId: user.id,
    },
  })
  const totalPages = Math.ceil(count / perPage)
  const skip = (page - 1) * perPage
  const nextPage = page < totalPages ? page + 1 : null
  const prevPage = page > 1 ? page - 1 : null

  const subscriptions = await db.subscription.findMany({
    where: {
      userId: user.id,
    },
    skip,
    take: perPage,
  })
  sendSuccessResponse({
    res,
    data: {
      subscriptions,
      nextPage,
      prevPage,
      totalPages,
    },
  })
})
const checkSubscriptionStatus = expressAsyncHandler(async (req, res) => {
  const user = res.locals.user as User
  const { channelId } = req.params as CheckSubscriptionStatusRequest['params']
  const subscription = await db.subscription.findFirst({
    where: {
      channelId,
      userId: user.id,
    },
  })
  sendSuccessResponse({
    res,
    data: {
      status: subscription ? 'subscribed' : 'not-subscribed',
    },
  })
})
const subscribe = expressAsyncHandler(async (req, res, next) => {
  const user = res.locals.user as User
  const { channelId } = req.params as unknown as SubscribeUnsubscribeRequest['params']
  // check whether the user has already subscribed to the channel
  const subscribedChannel = await db.subscription.findFirst({
    where: {
      channelId,
      userId: user.id,
    },
  })
  if (subscribedChannel)
    return next(
      createHttpError(StatusCodes.BAD_REQUEST, 'You have already subscribed to this channel'),
    )
  // create a new subscription
  const subscription = await db.subscription.create({
    data: {
      channelId,
      userId: user.id,
    },
  })
  return sendSuccessResponse({
    res,
    message: 'You have successfully subscribed to this channel',
    data: {
      subscription,
    },
  })
})
const unsubscribe = expressAsyncHandler(async (req, res, next) => {
  const user = res.locals.user as User
  // check whether the user has subscribed to the channel
  const { channelId } = req.params as unknown as SubscribeUnsubscribeRequest['params']
  const subscription = await db.subscription.findFirst({
    where: {
      channelId,
      userId: user.id,
    },
  })
  if (!subscription)
    return next(
      createHttpError(StatusCodes.BAD_REQUEST, 'You have not subscribed to this channel'),
    )
  await db.subscription.delete({
    where: {
      id: subscription.id,
    },
  })
  sendSuccessResponse({
    res,
    message: 'You have successfully unsubscribed from this channel',
  })
})

export { checkSubscriptionStatus, getSubscriptions, subscribe, unsubscribe }
