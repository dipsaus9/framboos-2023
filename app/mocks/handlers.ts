import { createNewPlayer } from './createNewPlayer'
// import { getOpenAPIDefinitionMSW } from '~/lib/api/@generated/framboos.msw'

import { getAdminMazeByPlayerId } from './getAdminMazeByPlayerId'
import { getPlayers } from './getAllPlayers'
import { getGameByPlayerId } from './getGameByPlayerId'
import { getPlayer } from './getPlayer'
import { getTournamentState } from './getTournamentState'

export const handlers = [
  getAdminMazeByPlayerId,
  getGameByPlayerId,
  getPlayers,
  getTournamentState,
  createNewPlayer,
  getPlayer,
]
