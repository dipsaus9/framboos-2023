import { faker } from '@faker-js/faker'
import { rest } from 'msw'

import type { Player } from '~/lib/api/@generated/framboos.schemas'

export const getAllPlayers = rest.get('*/admin/players', (req, res, ctx) => {
  const data: Player[] = [
    {
      emoji: '🍆',
      id: faker.string.uuid(),
      name: faker.name.firstName(),
    },
    {
      emoji: '🍑',
      id: faker.string.uuid(),
      name: faker.name.firstName(),
    },
  ]

  return res(ctx.delay(300), ctx.status(200, 'Mocked status'), ctx.json(data))
})
