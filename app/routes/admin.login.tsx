import type { ActionFunctionArgs } from '@remix-run/node'
import { Form } from '@remix-run/react'
import { redirect, typedjson, useTypedActionData } from 'remix-typedjson'

import { authSession } from '~/services/auth.server'

export async function action({ request }: ActionFunctionArgs) {
  let jsonValue: Record<string, any> = {}

  const contentType = request.headers.get('content-type')

  if (contentType && contentType.includes('application/json')) {
    jsonValue = await request.json()
  } else {
    const formData = await request.formData()

    formData.forEach((value, key) => (jsonValue[key] = value))
  }

  const { password } = jsonValue

  if (password !== process.env.ADMIN_PASSWORD) {
    return typedjson({
      status: 401,
      statusText: 'Unauthorized',
    })
  }

  const session = await authSession.getSession(request.headers.get('Cookie'))

  // Love the security risk right?
  session.set('password', password)

  return redirect('/admin/dashboard', {
    headers: {
      'Set-Cookie': await authSession.commitSession(session),
    },
  })
}

export default function LoginView() {
  const actionData = useTypedActionData<typeof action>()

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Form action="/admin/login" method="post" className="space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            {actionData ? actionData.statusText : null}
          </div>
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>
        </Form>
      </div>
    </div>
  )
}
