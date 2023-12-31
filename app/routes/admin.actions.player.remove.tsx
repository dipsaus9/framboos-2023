import type { ActionFunctionArgs } from '@remix-run/node'
import { typedjson } from 'remix-typedjson'

import { removePlayer } from '~/lib/api/@generated/framboos'
import { isLoggedIn } from '~/services/auth.server'

export async function action({ request }: ActionFunctionArgs) {
  if (!(await isLoggedIn(request))) {
    return typedjson(
      {
        status: 401,
        statusText: 'Unauthorized',
      },
      401,
    )
  }

  let jsonValue: Record<string, any> = {}

  const contentType = request.headers.get('content-type')

  if (contentType && contentType.includes('application/json')) {
    jsonValue = await request.json()
  } else {
    const formData = await request.formData()

    formData.forEach((value, key) => (jsonValue[key] = value))
  }

  const { playerId } = jsonValue

  await removePlayer(playerId)

  return typedjson({
    status: 200,
    statusText: 'OK',
  })
}
