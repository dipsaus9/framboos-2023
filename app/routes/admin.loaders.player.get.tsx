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

  const playerId = new URL(request.url).searchParams.get('playerId')

  if (!playerId) {
    return typedjson(
      {
        maze: null,
        players: [],
      },
      400,
    )
  }

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
