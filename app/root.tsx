import { cssBundleHref } from '@remix-run/css-bundle'
import type { LinksFunction } from '@remix-run/node'
import {
  isRouteErrorResponse,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from '@remix-run/react'

import stylesheet from '~/tailwind.css'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesheet },
  {
    rel: 'icon',
    href: '/256.png',
    type: 'image/png',
  },

  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
]

export default function App() {
  return (
    <html lang="nl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <Meta />
        <Links />
      </head>
      <body className=" bg-gray-200">
        <main>
          <Outlet />
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()

  return (
    <html lang="nl">
      <head>
        <title>Oops!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <main className="flex h-screen w-full flex-col items-center justify-center bg-[#1A2238]">
          <h1 className="text-9xl font-extrabold tracking-widest text-white">
            {isRouteErrorResponse(error)
              ? `${error.status}`
              : error instanceof Error
              ? error.message
              : 'Unknown Error'}
          </h1>
          <div className="absolute rotate-12 rounded bg-[#FF6A3D] px-2 text-sm">
            {isRouteErrorResponse(error)
              ? `${error.statusText}`
              : error instanceof Error
              ? error.message
              : 'Unknown Error'}
          </div>
        </main>
        <Scripts />
      </body>
    </html>
  )
}
