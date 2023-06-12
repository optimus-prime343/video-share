import { useInfiniteQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { api } from '@/core/utils/api'
import { parseAndThrowErrorResponse } from '@/core/utils/response'
import { VideoSchema } from '@/features/video/schemas/video'

export const GetSuggestedVideosResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    videos: z.array(VideoSchema),
    nextPage: z.number().nullable(),
    prevPage: z.number().nullable(),
    totalPages: z.number(),
  }),
})

export type GetSuggestedVideosResponse = z.infer<
  typeof GetSuggestedVideosResponseSchema
>['data']

export const useSuggestedVideos = (
  videoId: string | undefined,
  categoryId: string | undefined
) => {
  return useInfiniteQuery<GetSuggestedVideosResponse, Error>({
    queryKey: ['videos', 'suggested'],
    queryFn: ({ pageParam = 1 }) =>
      api
        .GET(GetSuggestedVideosResponseSchema, '/video/suggested-videos', {
          params: { videoId, categoryId, page: pageParam },
        })
        .then(res => res.data)
        .catch(parseAndThrowErrorResponse),
    enabled: !!(videoId && categoryId),
    getNextPageParam: lastPage => lastPage.nextPage,
    getPreviousPageParam: firstPage => firstPage.prevPage,
  })
}
