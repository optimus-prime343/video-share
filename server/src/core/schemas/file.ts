import { z } from 'zod'

export const FileSchema = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  encoding: z.string(),
  mimetype: z.string(),
  path: z.string(),
  size: z.number(),
})
export type File = z.infer<typeof FileSchema>
