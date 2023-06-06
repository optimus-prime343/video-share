import { AxiosInstance, AxiosRequestConfig, Method } from 'axios'
import { z, ZodTypeAny } from 'zod'

import { axiosInstance } from '@/core/lib/axios'

class Api {
  constructor(private readonly axiosInstance: AxiosInstance) {}

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
}

export const api = new Api(axiosInstance)
