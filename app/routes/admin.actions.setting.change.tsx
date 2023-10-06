import type { ActionFunctionArgs } from '@remix-run/node'
import { typedjson } from 'remix-typedjson'

import {
  updateMazeSize,
  updateRoundsPerTournament,
  updateScoringSettings,
  updateTimingSettings,
} from '~/lib/api/@generated/framboos'
import { isLoggedIn } from '~/services/auth.server'

export async function action({ request }: ActionFunctionArgs) {
  if (!(await isLoggedIn(request))) {
    return typedjson(
      {
        status: 401,
        statusText: 'Unauthorized',
      },
      401,
    )
  }

  let jsonValue: Record<string, any> = {}

  const contentType = request.headers.get('content-type')

  if (contentType && contentType.includes('application/json')) {
    jsonValue = await request.json()
  }

  const { type, ...rest } = jsonValue

  switch (type) {
    case 'mazeSize':
      try {
        await updateMazeSize(Number(rest.size))
      } catch {}
      break
    case 'roundsPerTournament':
      try {
        await updateRoundsPerTournament(Number(rest.roundsPerTournament))
      } catch {}
      break
    case 'time':
      try {
        await updateTimingSettings({
          idleTimeoutMs: Number(rest.idleTimeoutMs),
          explorationMoveIntervalMs: Number(rest.explorationMoveIntervalMs),
          speedRunMoveIntervalMs: Number(rest.speedRunMoveIntervalMs),
        })
      } catch {}
      break
    case 'points':
      try {
        await updateScoringSettings({
          pointsPerExploration: Number(rest.pointsPerExploration),
          maxPointsForSpeedRunning: Number(rest.maxPointsForSpeedRunning),
        })
      } catch {}
      break
  }

  return typedjson({
    status: 200,
    statusText: 'OK',
  })
}
