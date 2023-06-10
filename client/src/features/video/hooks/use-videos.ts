import { useQuery } from '@tanstack/react-query'
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

export const useVideos = () => {
  return useQuery<GetVideosResponse, Error>({
    queryKey: ['videos'],
    queryFn: () =>
      api
        .GET(GetVideosResponseSchema, '/video')
        .then(res => res.data)
        .catch(parseAndThrowErrorResponse),
  })
}
