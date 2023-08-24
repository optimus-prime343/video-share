import { z } from 'zod'

export const GetCommentsByVideoSchema = z.object({
  params: z.object({
    videoId: z.string().uuid(),
  }),
  query: z.object({
    page: z.number({ coerce: true }).gt(0).default(1),
    perPage: z.number({ coerce: true }).gt(0).default(10),
  }),
})
export const CreateCommentRequestSchema = z.object({
  body: z.object({
    text: z.string().nonempty(),
    videoId: z.string().uuid(),
  }),
})
export const UpdateCommentRequestSchema = z.object({
  body: z.object({
    text: z.string().nonempty(),
  }),
  params: z.object({
    commentId: z.string().uuid(),
  }),
})
export const DeleteCommentRequestSchema = z.object({
  params: z.object({
    commentId: z.string().uuid(),
  }),
})

export type GetCommentsByVideoRequest = z.infer<typeof GetCommentsByVideoSchema>
export type CreateCommentRequest = z.infer<typeof CreateCommentRequestSchema>
export type UpdateCommentRequest = z.infer<typeof UpdateCommentRequestSchema>
export type DeleteCommentRequest = z.infer<typeof DeleteCommentRequestSchema>
