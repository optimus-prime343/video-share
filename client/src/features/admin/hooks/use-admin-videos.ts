import { useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { api } from '@/core/utils/api'
import { parseAndThrowErrorResponse } from '@/core/utils/response'
import { VideoSchema } from '@/features/video/schemas/video'

export const GetVideosResponseSchema = z.object({
  data: z.object({
    videos: z.array(VideoSchema),
    nextPage: z.number().nullable(),
    prevPage: z.number().nullable(),
    totalPages: z.number(),
  }),
})
export type GetVideosResponse = z.infer<typeof GetVideosResponseSchema>['data']

export const useAdminVideos = (page = 1) => {
  return useQuery<GetVideosResponse, Error>({
    queryKey: ['admin-videos', { page }],
    queryFn: () =>
      api
        .GET(GetVideosResponseSchema, '/admin/videos', {
          params: {
            page,
          },
        })
        .then(res => res.data)
        .catch(parseAndThrowErrorResponse),
  })
}
