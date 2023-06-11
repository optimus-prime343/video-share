import { z } from 'zod'

import { THUMBNAIL_IMAGE_FIELD, VIDEO_FIELD } from '../../core/constants/strings.js'
import { FileSchema } from '../../core/schemas/file.js'

export const GetVideosSchema = z.object({
  query: z.object({
    page: z.number({ coerce: true }).default(1),
    perPage: z.number({ coerce: true }).default(10),
  }),
})

export const GetVideoDetailsSchema = z.object({
  params: z.object({
    videoId: z.string().uuid(),
  }),
})

export const CreateVideoSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(255),
    description: z.string().min(3).max(255).optional(),
    category: z.string().nonempty(),
  }),
  files: z.object({
    [THUMBNAIL_IMAGE_FIELD]: z.array(FileSchema.optional()),
    [VIDEO_FIELD]: z.array(FileSchema),
  }),
})

export const WatchVideSchema = z.object({
  params: z.object({
    videoId: z.string().uuid(),
  }),
})

export type GetVideosQuery = z.infer<typeof GetVideosSchema>['query']
export type GetVideoDetailsParams = z.infer<typeof GetVideoDetailsSchema>['params']
export type CreateVideoRequest = z.infer<typeof CreateVideoSchema>
export type WatchVideoParams = z.infer<typeof WatchVideSchema>['params']
