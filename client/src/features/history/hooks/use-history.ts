import { useInfiniteQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { api } from '@/core/utils/api'
import { parseAndThrowErrorResponse } from '@/core/utils/response'
import { useUser } from '@/features/auth/hooks/use-user'

import { HistorySchema } from '../schemas/history'

export const GetHistoryResponseSchema = z.object({
  data: z.object({
    history: z.array(HistorySchema),
    nextPage: z.number().nullable(),
    prevPage: z.number().nullable(),
    totalPages: z.number(),
  }),
})
export type GetHistoryResponse = z.infer<typeof GetHistoryResponseSchema>['data']

export const useHistory = () => {
  const { data: user } = useUser()
  return useInfiniteQuery<GetHistoryResponse, Error>({
    queryKey: ['history'],
    queryFn: () =>
      api
        .GET(GetHistoryResponseSchema, '/history')
        .catch(parseAndThrowErrorResponse)
        .then(res => res.data),
    getNextPageParam: lastPage => lastPage.nextPage,
    enabled: !!user,
  })
}
