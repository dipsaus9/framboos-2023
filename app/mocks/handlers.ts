// import { getOpenAPIDefinitionMSW } from '~/lib/api/@generated/framboos.msw'

import { getAdminMazeByPlayerId } from './getAdminMazeByPlayerId'
import { getAllPlayers } from './getAllPlayers'
import { getGameByPlayerId } from './getGameByPlayerId'

export const handlers = [
  getAdminMazeByPlayerId,
  getGameByPlayerId,
  getAllPlayers,
]
