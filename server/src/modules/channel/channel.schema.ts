import {} from 'multer'
import { z } from 'zod'

import { AVATAR_IMAGE_FIELD, THUMBNAIL_IMAGE_FIELD } from '../../core/constants/strings.js'
import { FileSchema } from '../../core/schemas/file.js'

export const CreateChannelSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(255),
    description: z.string().optional(),
  }),
  files: z.object({
    [THUMBNAIL_IMAGE_FIELD]: z.array(FileSchema),
    [AVATAR_IMAGE_FIELD]: z.array(FileSchema),
  }),
})
export const UpdateChannelSchema = CreateChannelSchema.extend({
  body: CreateChannelSchema.shape.body.partial(),
  params: z.object({
    id: z.string().uuid(),
  }),
  files: CreateChannelSchema.shape.files.partial(),
})

export const ChannelIdAsParamRequestSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
})
export const GetChannelVideosSchema = ChannelIdAsParamRequestSchema.extend({
  query: z.object({
    page: z.number({ coerce: true }).default(1),
    perPage: z.number({ coerce: true }).default(10),
  }),
})

export type CreateChannelRequest = z.infer<typeof CreateChannelSchema>
export type UpdateChannelRequest = z.infer<typeof UpdateChannelSchema>
export type ChannelIdAsParamRequest = z.infer<typeof ChannelIdAsParamRequestSchema>
export type GetChannelVideosRequest = z.infer<typeof GetChannelVideosSchema>
