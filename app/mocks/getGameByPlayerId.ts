import { faker } from '@faker-js/faker'
import { rest } from 'msw'

import type { PlayerDTO } from '~/lib/api/@generated/framboos.schemas'

export const getGameByPlayerId = rest.get(
  '*/player/:playerId',
  async (_req, res, ctx) => {
    const data: PlayerDTO = {
      playerId: faker.string.uuid(),
      name: faker.person.firstName(),
      emoji: '🍆',
      position: {
        x: 10,
        y: 5,
      },
      nrOfMoves: 10,
      state: 'Exploring',
    }

    return res(ctx.delay(300), ctx.status(200, 'Mocked status'), ctx.json(data))
  },
)
