import fs from 'node:fs/promises'

import type { UploadApiOptions } from 'cloudinary'

import { cloudinary } from '../lib/cloudinary.js'

export type UploadFolder = 'videos' | 'thumbnails' | 'avatars' | 'profile'

export interface UploadFileParams<TPath extends string | undefined> extends UploadApiOptions {
  path: TPath
  folder: UploadFolder
  userId: string
}

export const uploadFile = async <TPath extends string | undefined>({
  path,
  folder,
  userId,
  ...rest
}: UploadFileParams<TPath>): Promise<TPath> => {
  const folderByUser = `${userId}/${folder}`
  if (!path) return Promise.resolve(undefined) as unknown as TPath
  const result = await cloudinary.uploader.upload(path, {
    folder: folderByUser,
    unique_filename: true,
    overwrite: true,
    ...rest,
  })
  await fs.unlink(path) // Delete the file from the server
  return result.secure_url as unknown as TPath
}
