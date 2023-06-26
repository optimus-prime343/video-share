import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'

import { api } from '@/core/utils/api'
import { parseAndThrowErrorResponse } from '@/core/utils/response'
import type { CreateCommentFormData } from '@/features/comment/schemas/comment';
import { CommentSchema } from '@/features/comment/schemas/comment'

export const CreateCommentResponseSchema = z.object({
  message: z.string(),
  data: CommentSchema,
})
export type CreateCommentResponse = z.infer<typeof CreateCommentResponseSchema>
export const useCreateComment = () => {
  return useMutation<CreateCommentResponse, Error, CreateCommentFormData>({
    mutationFn: data =>
      api
        .POST(CreateCommentResponseSchema, '/comment', { data })
        .catch(parseAndThrowErrorResponse),
  })
}
