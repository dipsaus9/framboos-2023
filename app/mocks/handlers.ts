// import { getOpenAPIDefinitionMSW } from '~/lib/api/@generated/framboos.msw'

import { getAdminMazeByPlayerId } from './getAdminMazeByPlayerId'
import { getGameByPlayerId } from './getGameByPlayerId'

export const handlers = [getAdminMazeByPlayerId, getGameByPlayerId]
