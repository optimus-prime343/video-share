import fs from 'node:fs/promises'

import type { UploadApiOptions } from 'cloudinary'

import { cloudinary } from '../lib/cloudinary.js'
import type { File } from '../schemas/file.js'

export type UploadFolder = 'videos' | 'thumbnails' | 'avatars'

export interface UploadFileParams extends UploadApiOptions {
  file: File | undefined
  folder: UploadFolder
  userId: string
}

export const uploadFile = async ({
  file,
  folder,
  userId,
  ...rest
}: UploadFileParams): Promise<string | undefined> => {
  const folderByUser = `${folder}/${userId}`
  if (!file) return Promise.resolve(undefined)
  const result = await cloudinary.uploader.upload(file.path, {
    folder: folderByUser,
    unique_filename: true,
    overwrite: true,
    ...rest,
  })
  await fs.unlink(file.path) // Delete the file from the server
  return result.secure_url
}
