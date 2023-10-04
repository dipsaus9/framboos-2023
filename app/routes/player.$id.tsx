import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { typedjson, useTypedLoaderData } from 'remix-typedjson'

import { MazeView } from '~/components/Maze'
import {
  getCurrentGameState,
  getPracticeGameSummary,
} from '~/lib/api/@generated/framboos'
import type { PlayerDTO } from '~/lib/api/@generated/framboos.schemas'

export const meta: MetaFunction = () => {
  return [
    { title: 'Vrolijke Framboos | 2023' },
    { name: 'description', content: 'Los het doolhof op!' },
  ]
}

const testMaze = 20

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

  const currentPlayer = (await getCurrentGameState(playerId).catch(() => {
    throw new Response(null, {
      status: 404,
      statusText: 'Player not found',
    })
  })) as PlayerDTO

  if (!currentPlayer) {
    throw new Response(null, {
      status: 404,
      statusText: 'Player not found',
    })
  }

  const { maze } = await getPracticeGameSummary(String(testMaze)).catch(() => {
    throw new Response(null, {
      status: 404,
      statusText: 'Game not found',
    })
  })

  return typedjson({ maze, currentPlayer })
}

export default function PlayerView() {
  const { maze, currentPlayer } = useTypedLoaderData<typeof loader>()

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      <div className="flex flex-col items-center">
        <div className="my-10 flex flex-col items-center justify-center">
          <h1 className=" mb-0 text-3xl font-bold text-blue-900">
            Player: {currentPlayer.emoji}
          </h1>
          <p>Total moves: {currentPlayer.nrOfMoves}</p>
          <p>Game state: {currentPlayer.state}</p>
        </div>
        <MazeView maze={maze} player={currentPlayer} />
      </div>
    </div>
  )
}
