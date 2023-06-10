import { z } from 'zod'

import { getFullUploadUrl } from '@/core/utils/upload'

export const ChannelSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  thumbnail: z.string().optional().transform(getFullUploadUrl),
  avatar: z.string().optional().transform(getFullUploadUrl),
  userId: z.string(),
  createdAt: z.date({ coerce: true }),
  updatedAt: z.date({ coerce: true }),
})
export const ChannelFormSchema = z.object({
  name: z.string().nonempty(),
  description: z.string().nonempty().optional(),
})

export type Channel = z.infer<typeof ChannelSchema>
export type ChannelFormData = z.infer<typeof ChannelFormSchema>
