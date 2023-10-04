import type { LoaderFunctionArgs } from '@remix-run/node'
import { Outlet } from '@remix-run/react'
import { redirect, typedjson } from 'remix-typedjson'

import { authSession } from '~/services/auth.server'

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await authSession.getSession(request.headers.get('Cookie'))

  const password = session.get('password')

  const pathname = new URL(request.url).pathname

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    if (pathname !== '/admin/login') {
      return redirect('/admin/login')
    } else {
      return typedjson({ status: 'ok' })
    }
  }

  if (pathname !== '/admin/dashboard') {
    return redirect('/admin/dashboard')
  }

  return typedjson({ status: 'ok' })
}

export default function Admin() {
  return <Outlet />
}
