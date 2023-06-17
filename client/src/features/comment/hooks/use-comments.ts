import { useInfiniteQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { api } from '@/core/utils/api'
import { parseAndThrowErrorResponse } from '@/core/utils/response'
import { CommentSchema } from '@/features/comment/schemas/comment'

export const GetCommentsResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    comments: z.array(CommentSchema),
    nextPage: z.number().nullable(),
    prevPage: z.number().nullable(),
    totalPages: z.number(),
    count: z.number(),
  }),
})
export type GetCommentsResponse = z.infer<typeof GetCommentsResponseSchema>['data']
export const useComments = (videoId: string | undefined) => {
  return useInfiniteQuery<GetCommentsResponse, Error>({
    queryKey: ['comments', 'video', videoId],
    queryFn: ({ pageParam = 1 }) =>
      api
        .GET(GetCommentsResponseSchema, `/comment/video/${videoId}`, {
          params: {
            page: pageParam,
          },
        })
        .then(res => res.data)
        .catch(parseAndThrowErrorResponse),
    getNextPageParam: lastPage => lastPage.nextPage,
    getPreviousPageParam: firstPage => firstPage.prevPage,
    enabled: !!videoId,
  })
}
