export const getFullUploadUrl = (baseUrl: string | undefined): string => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  if (!apiUrl) throw new Error('baseUrl is undefined')
  if (!baseUrl) return ''
  const url = new URL(baseUrl, apiUrl)
  return url.toString()
}
