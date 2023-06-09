import { z } from 'zod'

export const VideoSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  url: z.string(),
  thumbnail: z.string().optional(),
  views: z.number(),
  likes: z.number(),
  dislikes: z.number(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
  createdAt: z.date({ coerce: true }),
  updatedAt: z.date({ coerce: true }),
})

export const VideoFormSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
})

export type Video = z.infer<typeof VideoSchema>
export type VideoFormData = z.infer<typeof VideoFormSchema>
