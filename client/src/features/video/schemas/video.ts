import { z } from 'zod'

import { ChannelSchema } from '@/features/channel/schemas/channel'

export const VideoStatus = z.enum(['PENDING', 'APPROVED', 'REJECTED'])

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
  url: z.string(),
  thumbnail: z.string(),
  views: z.number(),
  likes: z.number(),
  dislikes: z.number(),
  status: VideoStatus,
  channel: ChannelSchema,
  category: VideoCategory,
  createdAt: z.date({ coerce: true }),
  updatedAt: z.date({ coerce: true }),
})

export const VideoCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date({ coerce: true }),
  updatedAt: z.date({ coerce: true }).nullable(),
})

export const VideoFormSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().nonempty(),
  category: z.string().nonempty(),
})

export type Video = z.infer<typeof VideoSchema>
export type VideoCategory = z.infer<typeof VideoCategorySchema>
export type VideoFormData = z.infer<typeof VideoFormSchema>
export type VideoStatus = z.infer<typeof VideoStatus>
