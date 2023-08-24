export interface GenerateParams {
  name: string
  size?: number
  fontSize?: number
  rounded?: boolean
  background?: boolean
  format?: 'svg' | 'png'
}
export const generateUiAvatar = ({
  name,
  size = 64,
  fontSize = 0.5,
  rounded = true,
  background = false,
  format = 'svg',
}: GenerateParams): string => {
  const url = new URL('/api', 'https://ui-avatars.com')
  url.searchParams.append('name', name)
  url.searchParams.append('size', size.toString())
  url.searchParams.append('font-size', fontSize.toString())
  url.searchParams.append('rounded', rounded.toString())
  if (background) url.searchParams.append('background', background.toString())
  url.searchParams.append('format', format)
  return url.toString()
}
