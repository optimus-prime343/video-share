import { z } from 'zod'

export const ChannelSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  thumbnail: z.string().optional(),
  avatar: z.string().optional(),
  userId: z.string(),
  createdAt: z.date({ coerce: true }),
  updatedAt: z.date({ coerce: true }),
})
export const ChannelFormSchema = z.object({
  name: z.string().nonempty(),
  description: z.string().nonempty().optional(),
})

export type ChannelFormData = z.infer<typeof ChannelFormSchema>
