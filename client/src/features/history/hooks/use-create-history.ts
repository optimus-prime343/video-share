import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'

import { api } from '@/core/utils/api'
import { parseAndThrowErrorResponse } from '@/core/utils/response'

import { HistorySchema } from '../schemas/history'

export const CreateHistoryResponseSchema = z.object({
  message: z.string(),
  data: HistorySchema,
})
export interface CreateHistoryRequest {
  videoId: string
  timestamp: number
}
export interface CreateHistoryResponse extends z.infer<typeof CreateHistoryResponseSchema> {}

export const useCreateHistory = () => {
  return useMutation<CreateHistoryResponse, Error, CreateHistoryRequest>({
    mutationFn: data =>
      api
        .POST(CreateHistoryResponseSchema, '/history', { data })
        .catch(parseAndThrowErrorResponse),
  })
}
