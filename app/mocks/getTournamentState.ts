import { rest } from 'msw'

export const getTournamentState = rest.get(
  '*/admin/tournament',
  async (_req, res, ctx) => {
    return res(ctx.delay(300), ctx.status(200, 'Mocked status'), ctx.json(null))
  },
)
