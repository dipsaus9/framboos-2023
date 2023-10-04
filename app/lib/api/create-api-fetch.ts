import createFetch, { type FetchCallbacks } from '~/lib/createFetch'

import { getHost } from './getHost'

let defaultFetchCallbacks: FetchCallbacks = {}

if (process.env.NODE_ENV === 'development') {
  defaultFetchCallbacks = {}
}

export interface CreateApiFetchOptions {
  headers?: Record<string, string>
  fetchCallbacks?: FetchCallbacks
}

export const createApiFetch = ({
  headers = {},
  fetchCallbacks = defaultFetchCallbacks,
}: CreateApiFetchOptions) => {
  const fetcher = createFetch(headers, fetchCallbacks)

  return <T>(_url: string, options?: RequestInit) => {
    const url = `${getHost()}${_url}`

    return fetcher<T>(url, options)
  }
}
