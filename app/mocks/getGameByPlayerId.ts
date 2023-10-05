import { faker } from '@faker-js/faker'
import { rest } from 'msw'

import type { GameDTO } from '~/lib/api/@generated/framboos.schemas'
import { getHost } from '~/lib/api/getHost'

export const getGameByPlayerId = rest.get(
  '*/admin/game',
  async (_req, res, ctx) => {
    const gameId = _req.params.gameId

    const file =
      gameId === '10' || gameId === '20' || gameId === '50' ? gameId : '20'

    const { maze } = (await ctx
      .fetch(`${getHost()}/maze${file}x${file}.json`)
      .then((res) => res.json())) as GameDTO

    const data: GameDTO = {
      gameId: faker.datatype.uuid(),
      maze: maze,
      phase: 'Exploration',
      players: [
        {
          emoji: '🍑',
          name: faker.person.firstName(),
          nrOfMoves: faker.number.float({ min: 0, max: 10, precision: 1 }),
          playerId: faker.datatype.uuid(),
          position: {
            x: faker.datatype.number({ min: 0, max: maze.size }),
            y: faker.datatype.number({ min: 0, max: maze.size }),
          },
        },
      ],
    }

    return res(ctx.delay(300), ctx.status(200, 'Mocked status'), ctx.json(data))
  },
)
