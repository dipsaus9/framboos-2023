import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { useRevalidator } from '@remix-run/react'
import { typedjson, useTypedLoaderData } from 'remix-typedjson'

import { MazeView } from '~/components/Maze'
import {
  getGameForPlayer,
  getTournamentState,
} from '~/lib/api/@generated/framboos'
import { isLoggedIn } from '~/services/auth.server'

import { usePolling } from '../hooks/usePolling'
import { POLLING_INTERVAL } from '../lib/POLLING_INTERVAL'

export const meta: MetaFunction = () => {
  return [
    { title: 'Vrolijke Framboos | 2023' },
    { name: 'description', content: 'Los het doolhof op!' },
  ]
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const tournament = await getTournamentState().catch(() => null)

  const isInTournamentMode = !!tournament

  if (isInTournamentMode && !isLoggedIn(request)) {
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

  const data = await getGameForPlayer({
    playerId,
  }).catch(() => {
    return null
  })

  if (!data) {
    return typedjson({
      maze: null,
      players: [],
      playerId,
      gameId: null,
    })
  }

  return typedjson({
    maze: data.maze,
    players: data.players,
    playerId,
    gameId: data.gameId,
  })
}

export default function PlayerView() {
  const { maze, players, playerId, gameId } =
    useTypedLoaderData<typeof loader>()

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
        <div className="my-10 flex flex-col">
          {currentPlayer && maze ? (
            <>
              <h1 className="mb-10 text-5xl font-semibold leading-7 text-gray-900">
                Player: {currentPlayer.name}
              </h1>
              <p className="mb-1">
                <strong>Player ID:</strong> {currentPlayer.playerId}
              </p>
              <p className="mb-1">
                <strong>Game ID:</strong> {gameId}
              </p>
              <p className="mb-10">
                <strong>Total moves:</strong> {currentPlayer.nrOfMoves}
              </p>
              <MazeView maze={maze} players={players} />
            </>
          ) : (
            <h1 className="mb-10 text-5xl font-semibold leading-7 text-gray-900">
              Currently not in a game, request a new game first
            </h1>
          )}
        </div>
      </div>
    </div>
  )
}
