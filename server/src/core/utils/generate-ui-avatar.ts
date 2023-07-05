export interface GenerateParams {
  name: string
  size?: number
  fontSize?: number
  rounded?: boolean
  randomBackground?: boolean
  format?: 'svg' | 'png'
}
export const generateUiAvatar = ({
  name,
  size = 64,
  fontSize = 0.5,
  rounded = true,
  randomBackground = true,
  format = 'svg',
}: GenerateParams): string => {
  const url = new URL('/api', 'https://ui-avatars.com')
  url.searchParams.append('name', name)
  url.searchParams.append('size', size.toString())
  url.searchParams.append('font-size', fontSize.toString())
  url.searchParams.append('rounded', rounded.toString())
  url.searchParams.append('background', randomBackground.toString())
  url.searchParams.append('format', format)
  return url.toString()
}
