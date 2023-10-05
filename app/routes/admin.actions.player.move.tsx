import type { ActionFunctionArgs } from '@remix-run/node'
import { typedjson } from 'remix-typedjson'

import type {
  GameStateDTO,
  MoveRequest,
} from '~/lib/api/@generated/framboos.schemas'
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

  const { gameId, playerId, direction } = jsonValue

  const game = await move({
    gameId,
    playerId,
    direction,
  }).catch(() => {
    return null
  })

  return typedjson({ game })
}

function move(moveRequest: MoveRequest) {
  return customFetchInstance<GameStateDTO>({
    url: `/game/move`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer password`,
    },
    data: moveRequest,
  })
}
