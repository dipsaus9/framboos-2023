import { faker } from '@faker-js/faker'
import { rest } from 'msw'

import type { GameStateDTO } from '~/lib/api/@generated/framboos.schemas'

let nrOfMoves = 0

export const getPlayer = rest.get('*/player/:id', async (_req, res, ctx) => {
  nrOfMoves++

  const gameState: GameStateDTO = {
    gameId: faker.datatype.uuid(),
    state: 'Playing',
    gamePhase: 'Exploration',
    nrOfMoves,
    position: {
      x: faker.datatype.number({ min: 0, max: 10 }),
      y: faker.datatype.number({ min: 0, max: 10 }),
    },
    score: {
      exploration: 100,
      speedRunning: 100,
    },
    walls: [],
  }

  return res(
    ctx.delay(300),
    ctx.status(200, 'Mocked status'),
    ctx.json(gameState),
  )
})
