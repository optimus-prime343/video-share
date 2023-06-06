import { AxiosError } from 'axios'

export const parseAndThrowErrorResponse = (error: unknown): never => {
  const message =
    error instanceof AxiosError
      ? error.response?.data?.message
      : error instanceof Error
      ? error.message
      : 'Something went wrong.'
  throw new Error(message)
}
