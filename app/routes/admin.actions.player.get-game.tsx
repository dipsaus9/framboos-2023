import type { ActionFunctionArgs } from '@remix-run/node'
import { typedjson } from 'remix-typedjson'

import type { GameStateDTO } from '~/lib/api/@generated/framboos.schemas'
import { customFetchInstance } from '~/lib/api/customFetchInstance'
import { isLoggedIn } from '~/services/auth.server'

export async function action({ request }: ActionFunctionArgs) {
  if (!(await isLoggedIn(request))) {
    return typedjson(null, 401)
  }

  let jsonValue: Record<string, any> = {}

  const contentType = request.headers.get('content-type')

  if (contentType && contentType.includes('application/json')) {
    jsonValue = await request.json()
  } else {
    try {
      const formData = await request.formData()

      formData.forEach((value, key) => (jsonValue[key] = value))
    } catch (e) {
      return typedjson(null, 400)
    }
  }

  const { playerId } = jsonValue

  const game = await getCurrentGameState(playerId).catch(() => {
    return null
  })

  return typedjson({ game })
}

function getCurrentGameState(playerId: string) {
  return customFetchInstance<GameStateDTO>({
    url: `/player/${playerId}`,
    method: 'get',
    headers: {
      Authorization: `Bearer password`,
    },
  })
}
