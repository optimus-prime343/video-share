import crypto from 'node:crypto'
import path from 'node:path'

import multer from 'multer'

export const fileDiskStorage = multer.diskStorage({
  filename: (_req, file, cb) => {
    const uuid = crypto.randomUUID()
    const extension = path.extname(file.originalname)
    cb(null, `${uuid}${extension}`)
  },
})
