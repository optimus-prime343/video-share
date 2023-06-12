import { QueryClient } from '@tanstack/react-query'
import axios, { AxiosInstance, AxiosRequestConfig, Method } from 'axios'
import { z, ZodTypeAny } from 'zod'

import { axiosInstance } from '@/core/lib/axios'

class Api {
  private readonly queryClient: QueryClient
  constructor(private readonly axiosInstance: AxiosInstance) {
    this.refreshTokenInterceptor()
    this.queryClient = new QueryClient()
  }

  public async GET<TSchema extends ZodTypeAny>(
    schema: TSchema,
    url: string,
    config?: AxiosRequestConfig
  ) {
    return await this.request(schema, url, 'GET', config)
  }

  public async POST<TSchema extends ZodTypeAny>(
    schema: TSchema,
    url: string,
    config?: AxiosRequestConfig
  ) {
    return await this.request(schema, url, 'POST', config)
  }

  public async PATCH<TSchema extends ZodTypeAny>(
    schema: TSchema,
    url: string,
    config?: AxiosRequestConfig
  ) {
    return await this.request(schema, url, 'PATCH', config)
  }

  public async PUT<TSchema extends ZodTypeAny>(
    schema: TSchema,
    url: string,
    config?: AxiosRequestConfig
  ) {
    return await this.request(schema, url, 'PUT', config)
  }

  public async DELETE<TSchema extends ZodTypeAny>(
    schema: TSchema,
    url: string,
    config?: AxiosRequestConfig
  ) {
    return await this.request(schema, url, 'DELETE', config)
  }

  private async request<TSchema extends ZodTypeAny>(
    schema: TSchema,
    url: string,
    method: Method,
    config?: AxiosRequestConfig
  ): Promise<z.infer<typeof schema>> {
    try {
      const { data } = await this.axiosInstance({
        url,
        method,
        ...config,
      })
      const parsedData = schema ? await schema.parseAsync(data) : data
      return parsedData
    } catch (error) {
      console.error(error)
      throw error
    }
  }
  private refreshTokenInterceptor() {
    this.axiosInstance.interceptors.response.use(
      response => response,
      async error => {
        const { config } = error
        const isJwtExpiredMessage = error?.response?.data?.message === 'jwt expired'
        if (!isJwtExpiredMessage) return Promise.reject(error)
        return axios
          .get('/auth/refresh-token', {
            baseURL: process.env.NEXT_PUBLIC_API_REQUEST_URL ?? 'http://localhost:8000/api/v1',
            withCredentials: true,
            timeout: 30000,
          })
          .then(async () => {
            await this.queryClient.invalidateQueries(['user'])
            return this.axiosInstance(config)
          })
          .catch(error => Promise.reject(error))
      }
    )
  }
}

export const api = new Api(axiosInstance)
