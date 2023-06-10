export const getFullUploadUrl = (baseUrl: string | undefined): string | undefined => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  if (!apiUrl) throw new Error('baseUrl is undefined')
  if (!baseUrl) return undefined
  const url = new URL(baseUrl, apiUrl)
  return url.toString()
}
