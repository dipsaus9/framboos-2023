import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { useRevalidator } from '@remix-run/react'
import { typedjson, useTypedLoaderData } from 'remix-typedjson'

import { MazeView } from '~/components/Maze'
import { getGameStatusForPlayer } from '~/lib/api/@generated/framboos'

import { usePolling } from '../hooks/usePolling'

export const meta: MetaFunction = () => {
  return [
    { title: 'Vrolijke Framboos | 2023' },
    { name: 'description', content: 'Los het doolhof op!' },
  ]
}

const POLLING_INTERVAL = 500 // half a second

export async function loader({ params }: LoaderFunctionArgs) {
  const isGameInTournamentMode = false

  if (isGameInTournamentMode) {
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
    throw new Response(null, {
      status: 404,
      statusText: 'Game not found',
    })
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

  const currentPlayer = players.find((player) => player.playerId === playerId)!

  return (
    <div>
      <div className="flex flex-col items-center">
        <div className="my-10 flex flex-col items-center justify-center">
          <h1 className=" mb-0 text-3xl font-bold text-blue-900">
            Player: {currentPlayer.name}
          </h1>
          <p>Total moves: {currentPlayer.nrOfMoves}</p>
        </div>
        <MazeView maze={maze} players={players} />
      </div>
    </div>
  )
}
