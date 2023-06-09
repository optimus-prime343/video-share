import type { Options } from 'multer'

import { IMAGE_FILE_REGEX, VIDEO_FILE_REGEX } from '../constants/regex.js'

type FileFilterHandler = Options['fileFilter']

export const imageFileFilter: FileFilterHandler = (_request, file, callback): void => {
  const isValid = IMAGE_FILE_REGEX.test(file.originalname)
  if (!isValid) {
    return callback(new Error('Invalid image file'))
  }
  callback(null, true)
}

export const videoFileFilter: FileFilterHandler = (_request, file, callback) => {
  const isValid = VIDEO_FILE_REGEX.test(file.originalname)
  if (!isValid) {
    return callback(new Error('Invalid video file'))
  }
  callback(null, true)
}

export const imageOrVideoFileFilter: FileFilterHandler = (_request, file, callback) => {
  const isValid =
    IMAGE_FILE_REGEX.test(file.originalname) || VIDEO_FILE_REGEX.test(file.originalname)
  if (!isValid) {
    return callback(new Error('Invalid image or video file'))
  }
  callback(null, true)
}
