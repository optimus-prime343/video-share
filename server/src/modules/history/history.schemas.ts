import { z } from 'zod'

export const GetHistoryRequestSchema = z.object({
  query: z.object({
    page: z.number({ coerce: true }).default(1),
    perPage: z.number({ coerce: true }).default(10),
  }),
})

export const CreateHistoryRequestSchema = z.object({
  body: z.object({
    videoId: z.string().uuid(),
    timestamp: z.number().default(0),
  }),
})

export type GetHistoryRequest = z.infer<typeof GetHistoryRequestSchema>
export type CreateHistoryRequest = z.infer<typeof CreateHistoryRequestSchema>
