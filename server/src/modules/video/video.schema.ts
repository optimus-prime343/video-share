import { z } from 'zod'

import { FileSchema } from '../../core/schemas/file.js'

export const CreateVideoSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(255),
    description: z.string().min(3).max(255).optional(),
  }),
  file: FileSchema,
})

export const WatchVideSchema = z.object({
  params: z.object({
    videoId: z.string().uuid(),
  }),
})

export type CreateVideoRequest = z.infer<typeof CreateVideoSchema>
export type WatchVideoParams = z.infer<typeof WatchVideSchema>['params']
