import { useEffect, useRef } from 'react'

import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { useRevalidator } from '@remix-run/react'
import { typedjson, useTypedLoaderData } from 'remix-typedjson'

import { MazeView } from '~/components/Maze'
import { getGameStatusForPlayer } from '~/lib/api/@generated/framboos'

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

  return typedjson({ maze, currentPlayer: players[0] })
}

export default function PlayerView() {
  const { maze, currentPlayer } = useTypedLoaderData<typeof loader>()

  const revalidator = useRevalidator()

  // run when you need to update
  const timerIdRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const pollingCallback = () => {
      // Your polling logic here
      if (revalidator.state === 'idle') {
        revalidator.revalidate()
      }
    }

    const startPolling = () => {
      // pollingCallback(); // To immediately start fetching data
      // Polling every 30 seconds

      timerIdRef.current = setInterval(pollingCallback, POLLING_INTERVAL)
    }

    const stopPolling = () => {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current)
      }
    }

    startPolling()

    return () => {
      stopPolling()
    }
  }, [revalidator])

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      <div className="flex flex-col items-center">
        <div className="my-10 flex flex-col items-center justify-center">
          <h1 className=" mb-0 text-3xl font-bold text-blue-900">
            Player: {currentPlayer.name}
          </h1>
          <p>Total moves: {currentPlayer.nrOfMoves}</p>
        </div>
        <MazeView maze={maze} player={currentPlayer} />
      </div>
    </div>
  )
}
