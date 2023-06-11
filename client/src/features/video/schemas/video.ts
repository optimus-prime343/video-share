import { z } from 'zod'

import { getFullUploadUrl } from '@/core/utils/upload'
import { ChannelSchema } from '@/features/channel/schemas/channel'

export const VideoCategory = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date({ coerce: true }),
  updatedAt: z.date({ coerce: true }),
})
export const VideoSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  url: z.string().transform(getFullUploadUrl),
  thumbnail: z.string().optional().transform(getFullUploadUrl),
  views: z.number(),
  likes: z.number(),
  dislikes: z.number(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
  channel: ChannelSchema,
  category: VideoCategory,
  createdAt: z.date({ coerce: true }),
  updatedAt: z.date({ coerce: true }),
})

export const VideoFormSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().optional(),
  category: z.string().nonempty(),
})

export type Video = z.infer<typeof VideoSchema>
export type VideoFormData = z.infer<typeof VideoFormSchema>
