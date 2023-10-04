import { rest } from 'msw'

import type { GameDTO } from '~/lib/api/@generated/framboos.schemas'
import { getHost } from '~/lib/api/getHost'

export const getAdminMazeByPlayerId = rest.get(
  '*/admin/game/:gameId',
  async (_req, res, ctx) => {
    const gameId = _req.params.gameId

    const file =
      gameId === '10' || gameId === '20' || gameId === '50' ? gameId : '20'

    const data = (await ctx
      .fetch(`${getHost()}/maze${file}x${file}.json`)
      .then((res) => res.json())) as GameDTO

    return res(ctx.delay(300), ctx.status(200, 'Mocked status'), ctx.json(data))
  },
)
