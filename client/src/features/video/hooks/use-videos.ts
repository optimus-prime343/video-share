import { useInfiniteQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { api } from '@/core/utils/api'
import { parseAndThrowErrorResponse } from '@/core/utils/response'
import { VideoSchema } from '@/features/video/schemas/video'

export const GetVideosResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    videos: z.array(VideoSchema),
    nextPage: z.number().nullable(),
    prevPage: z.number().nullable(),
    totalPages: z.number(),
  }),
})

export type GetVideosResponse = z.infer<typeof GetVideosResponseSchema>['data']

export const useVideos = (category: string | undefined) => {
  return useInfiniteQuery({
    queryKey: ['videos', category],
    queryFn: ({ pageParam = 1 }) =>
      api
        .GET(GetVideosResponseSchema, '/video', {
          params: {
            page: pageParam,
            category,
          },
        })
        .then(res => res.data)
        .catch(parseAndThrowErrorResponse),
    getNextPageParam: (lastPage, _pages) => lastPage.nextPage,
    getPreviousPageParam: (firstPage, _pages) => firstPage.prevPage,
  })
}
