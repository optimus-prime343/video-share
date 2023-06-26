import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

import { createCanvas } from 'canvas'

const WIDTH = 200
const HEIGHT = 200

export const createDefaultProfileImage = async (username: string): Promise<string> => {
  const canvas = createCanvas(WIDTH, HEIGHT)
  const context = canvas.getContext('2d')
  //background color
  context.fillStyle = getRandomColor()
  context.fillRect(0, 0, WIDTH, HEIGHT)
  //text
  context.font = 'bold 100px Arial'
  context.textAlign = 'center'
  //  set text color
  context.fillStyle = '#000'
  context.fillText(username.slice(0, 2).toUpperCase(), WIDTH / 2, HEIGHT / 1.5)
  const buffer = canvas.toBuffer('image/png')
  const imageId = crypto.randomUUID()
  const imagePath = `/profile/${imageId}.png`
  const imageUploadUrl = path.join(process.cwd(), 'public', imagePath)
  await fs.writeFile(imageUploadUrl, buffer)
  return imagePath
}

const getRandomColor = (): string =>
  '#' + (((1 << 24) * Math.random()) | 0).toString(16).padStart(6, '0')
