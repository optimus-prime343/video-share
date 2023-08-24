import { z } from 'zod'

import { VideoSchema } from '@/features/video/schemas/video'

export const HistorySchema = z.object({
  id: z.string().uuid(),
  video: VideoSchema,
  userId: z.string().uuid(),
  timestamp: z.number(),
  createdAt: z.date({ coerce: true }),
  updatedAt: z.date({ coerce: true }).optional(),
})

export interface IHistory extends z.infer<typeof HistorySchema> {}
