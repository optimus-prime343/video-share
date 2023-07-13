import { useInfiniteQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { api } from '@/core/utils/api'
import { parseAndThrowErrorResponse } from '@/core/utils/response'
import { VideoSchema } from '@/features/video/schemas/video'

export const GetChannelVideosResponseSchema = z.object({
  data: z.object({
    videos: z.array(VideoSchema),
    nextPage: z.number().nullable(),
    prevPage: z.number().nullable(),
    totalPages: z.number(),
  }),
})
export type GetChannelVideosResponse = z.infer<typeof GetChannelVideosResponseSchema>['data']

export const useChannelVideos = (channelId: string) => {
  return useInfiniteQuery<GetChannelVideosResponse, Error>({
    queryKey: ['channel-videos', channelId],
    queryFn: async ({ pageParam = 1 }) =>
      api
        .GET(GetChannelVideosResponseSchema, `/channel/videos/${channelId}`, {
          params: { page: pageParam },
        })
        .then(res => res.data)
        .catch(parseAndThrowErrorResponse),
    getNextPageParam: lastPage => lastPage.nextPage,
  })
}
