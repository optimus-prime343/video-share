import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

import type { File } from '../schemas/file.js'

export type UploadFileDir = 'thumbnails' | 'avatars' | 'videos'

export const uploadFile = async (
  file: File | undefined,
  directory: UploadFileDir,
): Promise<string | undefined> => {
  if (file === undefined) return Promise.resolve(undefined)
  const fileExt = path.extname(file.originalname)
  const fileName = crypto.randomUUID() + fileExt
  const uploadPathDb = `/${directory}/${fileName}`
  const uploadPathFull = path.join(process.cwd(), 'public', uploadPathDb)
  await fs.writeFile(uploadPathFull, file.buffer)
  return uploadPathDb
}
