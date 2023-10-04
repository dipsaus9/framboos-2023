import type { LoaderFunctionArgs } from '@remix-run/node'
import { typedjson } from 'remix-typedjson'

import { getGameForPlayer } from '~/lib/api/@generated/framboos'
import { isLoggedIn } from '~/services/auth.server'

export async function loader({ request }: LoaderFunctionArgs) {
  if (!(await isLoggedIn(request))) {
    return typedjson(
      {
        maze: null,
        players: [],
      },
      401,
    )
  }

  let jsonValue: Record<string, any> = {}

  const contentType = request.headers.get('content-type')

  if (contentType && contentType.includes('application/json')) {
    jsonValue = await request.json()
  } else {
    try {
      const formData = await request.formData()

      formData.forEach((value, key) => (jsonValue[key] = value))
    } catch {
      return typedjson(
        {
          maze: null,
          players: [],
        },
        400,
      )
    }
  }

  const { playerId } = jsonValue

  const { maze, players } = await getGameForPlayer({
    playerId,
  }).catch(() => {
    return {
      maze: null,
      players: [],
    }
  })

  return typedjson({ maze, players, playerId })
}
