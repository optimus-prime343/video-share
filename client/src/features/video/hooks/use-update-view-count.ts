import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'

import { api } from '@/core/utils/api'
import { parseAndThrowErrorResponse } from '@/core/utils/response'

export const UpdateViewCountResponseSchema = z.object({
  message: z.string(),
})
export const useUpdateViewCount = () => {
  return useMutation<string, Error, string>({
    mutationFn: videoId =>
      api
        .POST(UpdateViewCountResponseSchema, `/video/${videoId}/view`)
        .then(res => res.message)
        .catch(parseAndThrowErrorResponse),
  })
}
