import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { api } from '@/core/utils/api'

import { ChannelSchema } from '../schemas/channel'

export const GetChannelDetailsResponseSchema = z.object({
  data: ChannelSchema.extend({
    totalSubscribers: z.number(),
    totalViews: z.number(),
  }),
})
export type GetChannelDetailsResponse = z.infer<typeof GetChannelDetailsResponseSchema>['data']

export const useChannelDetail = (channelId: string | undefined) => {
  return useQuery<GetChannelDetailsResponse, Error>({
    queryKey: ['channel', channelId],
    queryFn: () =>
      api.GET(GetChannelDetailsResponseSchema, `/channel/${channelId}`).then(res => res.data),
    enabled: !!channelId,
  })
}
