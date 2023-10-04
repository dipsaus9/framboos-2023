import type { MetaFunction } from '@remix-run/node'
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

export async function loader() {
  const { maze } = await getPracticeGameSummary(String(testMaze))

  const currentPlayer = (await getCurrentGameState('test')) as PlayerDTO

  return typedjson({ maze, currentPlayer })
}

export default function Index() {
  const { maze, currentPlayer } = useTypedLoaderData<typeof loader>()

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      <h1 className="text-3xl font-bold text-blue-900 underline">
        Vrolijke Framboos
      </h1>
      <div className="flex justify-center">
        <MazeView maze={maze} player={currentPlayer} />
      </div>
    </div>
  )
}
