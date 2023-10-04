import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { useRevalidator } from '@remix-run/react'
import { typedjson, useTypedLoaderData } from 'remix-typedjson'

import { MazeView } from '~/components/Maze'
import {
  getGameStatusForPlayer,
  getTournamentState,
} from '~/lib/api/@generated/framboos'

import { usePolling } from '../hooks/usePolling'
import { POLLING_INTERVAL } from '../lib/POLLING_INTERVAL'

export const meta: MetaFunction = () => {
  return [
    { title: 'Vrolijke Framboos | 2023' },
    { name: 'description', content: 'Los het doolhof op!' },
  ]
}

export async function loader({ params }: LoaderFunctionArgs) {
  const tournament = await getTournamentState().catch(() => null)

  const isInTournamentMode = !!tournament

  if (isInTournamentMode) {
    throw new Response(null, {
      status: 404,
      statusText: 'Game is in tournament mode',
    })
  }

  const playerId = params.id

  if (!playerId) {
    throw new Response(null, {
      status: 404,
      statusText: 'Player not found',
    })
  }

  const { maze, players } = await getGameStatusForPlayer({
    playerId,
  }).catch(() => {
    return {
      maze: null,
      players: [],
    }
  })

  return typedjson({ maze, players, playerId })
}

export default function PlayerView() {
  const { maze, players, playerId } = useTypedLoaderData<typeof loader>()

  const revalidator = useRevalidator()

  usePolling(() => {
    if (revalidator.state === 'idle') {
      revalidator.revalidate()
    }
  }, POLLING_INTERVAL)

  const currentPlayer = players.find((player) => player.playerId === playerId)

  return (
    <div>
      <div className="flex flex-col items-center">
        <div className="my-10 flex flex-col items-center justify-center">
          {currentPlayer && maze ? (
            <>
              <h1 className="mb-4 text-3xl font-bold text-blue-900">
                Player: {currentPlayer.name}
              </h1>
              <p className="mb-4">Total moves: {currentPlayer.nrOfMoves}</p>
              <MazeView maze={maze} players={players} />
            </>
          ) : (
            <h1 className="mb-0 text-3xl font-bold text-blue-900">
              Currently not in a game, request a new game first
            </h1>
          )}
        </div>
      </div>
    </div>
  )
}
