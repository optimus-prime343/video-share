import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'

import { api } from '@/core/utils/api'
import { parseAndThrowErrorResponse } from '@/core/utils/response'

export const DeleteCommentResponseSchema = z.object({
  message: z.string(),
})

export const useDeleteComment = () => {
  return useMutation<string, Error, string>({
    mutationFn: commentId =>
      api
        .DELETE(DeleteCommentResponseSchema, `/comment/${commentId}`)
        .then(data => data.message)
        .catch(parseAndThrowErrorResponse),
  })
}
