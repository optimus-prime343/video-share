import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

import { createCanvas } from 'canvas'

const WIDTH = 200
const HEIGHT = 200

export interface CreateDefaultImageOptions {
  word: string
  uploadDir: string
  width?: number
  height?: number
}
export const createDefaultImage = async ({
  word,
  uploadDir,
  width = WIDTH,
  height = HEIGHT,
}: CreateDefaultImageOptions): Promise<string> => {
  const canvas = createCanvas(width, height)
  const context = canvas.getContext('2d')
  //background color
  context.fillStyle = getRandomColor()
  context.fillRect(0, 0, width, height)
  //text
  context.font = 'bold 100px Arial'
  context.textAlign = 'center'
  //  set text color
  context.fillStyle = '#000'
  context.fillText(word, width / 2, height / 1.5)
  const buffer = canvas.toBuffer('image/png')
  const imageId = crypto.randomUUID()
  const imagePath = `/${uploadDir}/${imageId}.png`
  const uploadPath = path.join(process.cwd(), 'public', imagePath)
  await fs.writeFile(uploadPath, buffer)
  return imagePath
}

const getRandomColor = (): string =>
  '#' + (((1 << 24) * Math.random()) | 0).toString(16).padStart(6, '0')
