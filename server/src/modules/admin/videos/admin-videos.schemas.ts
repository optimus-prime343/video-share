import { z } from 'zod'

export const GetVideosRequestSchema = z.object({
  query: z.object({
    page: z.number({ coerce: true }).default(1),
    perPage: z.number({ coerce: true }).default(10),
  }),
})

export const UpdateVideoRequestSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
  }),
})

export type GetVideosRequest = z.infer<typeof GetVideosRequestSchema>
export type UpdateVideoRequest = z.infer<typeof UpdateVideoRequestSchema>
