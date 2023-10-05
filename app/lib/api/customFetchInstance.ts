import createFetch from '../createFetch'
import type { FetchError } from '../FetchError'

const baseURL = process.env.PUBLIC_HOST ?? 'http://localhost:3000'

interface RequestConfig {
  method: 'get' | 'put' | 'patch' | 'post' | 'delete'
  url: string
  params?: any
  data?: any
  responseType?: string
  headers?: Record<string, string>
}

export async function customFetchInstance<T>({
  url,
  method,
  params,
  data,
  headers,
}: RequestConfig): Promise<T> {
  const fetcher = createFetch({
    accept: 'application/json',
    Authorization: `Bearer ${process.env.ADMIN_API_KEY}`,
    ...headers,
  })

  const searchParams = params ? `?${new URLSearchParams(params)}` : ''

  return fetcher<T>(`${baseURL}${url}` + searchParams, {
    method: method.toUpperCase(),
    ...(data ? { body: JSON.stringify(data) } : {}),
  })
}

export type ErrorType = FetchError
