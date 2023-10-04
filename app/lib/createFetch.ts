import { parseISO } from 'date-fns'

import { FetchError } from './FetchError'

function isIsoDateString(value: any): boolean {
  return (
    value &&
    typeof value === 'string' &&
    new Date(value) instanceof Date &&
    !isNaN(new Date(value).getTime())
  )
}

function handleDates(body: any) {
  if (body === null || body === undefined || typeof body !== 'object') {
    return body
  }

  for (const key of Object.keys(body)) {
    const value = body[key]

    if (isIsoDateString(value)) {
      body[key] = parseISO(value)
    } else if (typeof value === 'object') {
      handleDates(value)
    }
  }

  return body
}

export enum FetchMethods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
}

export interface FetchCallbacks {
  onBeforeRequest?: (url: string, requestOptions: RequestInit) => void
  onAfterRequest?: (response: Response) => void
  onError?: (error: unknown) => void
}

export type CreateFetchReturnType = <T>(
  url: string,
  options?: RequestInit,
) => Promise<T>

const createFetch = (
  headers?: Record<string, string>,
  callbacks?: FetchCallbacks,
): CreateFetchReturnType => {
  const defaultHeaders = new Headers({
    Accept: 'application/ld+json',
  })

  if (headers) {
    Object.entries(headers).forEach(([key, value]) => {
      defaultHeaders.set(key, value)
    })
  }

  const fetchOptions: RequestInit = {
    method: FetchMethods.GET,
    headers: defaultHeaders,
  }

  return async <T>(url: string, options?: RequestInit): Promise<T> => {
    const { onBeforeRequest, onAfterRequest, onError } = callbacks ?? {}

    fetchOptions.method = options?.method ?? fetchOptions.method
    const mergedOptions = { ...fetchOptions, ...options }

    if (onBeforeRequest) {
      onBeforeRequest(url, mergedOptions)
    }

    try {
      const fetchResponse = await fetch(url, mergedOptions)

      if (onAfterRequest) {
        onAfterRequest(fetchResponse)
      }

      if (!fetchResponse.ok) {
        throw new FetchError(fetchResponse)
      }

      const response = await fetchResponse.json()

      return handleDates(response) as T
    } catch (error) {
      if (onError) {
        onError(error)
      }

      // @note: should we throw or just pass it to onError?
      throw error
    }
  }
}

export default createFetch
