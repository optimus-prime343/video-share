import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'

import { api } from '@/core/utils/api'
import { parseAndThrowErrorResponse } from '@/core/utils/response'

export const UpdateCommentResponseSchema = z.object({
  message: z.string(),
})
export interface UpdateCommentRequest {
  text: string
  commentId: string
}
export const useUpdateComment = () => {
  return useMutation<string, Error, UpdateCommentRequest>({
    mutationFn: ({ commentId, text }) =>
      api
        .PATCH(UpdateCommentResponseSchema, `/comment/${commentId}`, { data: { text } })
        .then(data => data.message)
        .catch(parseAndThrowErrorResponse),
  })
}
