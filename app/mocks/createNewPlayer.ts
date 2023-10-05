import { rest } from 'msw'

export const createNewPlayer = rest.post('*/player', async (_req, res, ctx) => {
  return res(ctx.delay(300), ctx.status(200, 'Mocked status'), ctx.json(null))
})
