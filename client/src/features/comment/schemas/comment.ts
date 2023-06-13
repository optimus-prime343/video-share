import { z } from 'zod'

export const CommentSchema = z.object({
  id: z.string().uuid(),
  text: z.string().nonempty(),
  userId: z.string().uuid(),
  videoId: z.string().uuid(),
  createdAt: z.date({ coerce: true }),
  updatedAt: z.date({ coerce: true }),
})

export const CreateCommentFormSchema = z.object({
  text: z.string().nonempty(),
  videoId: z.string().uuid(),
})

export type Comment = z.infer<typeof CommentSchema>
export type CreateCommentFormData = z.infer<typeof CreateCommentFormSchema>
