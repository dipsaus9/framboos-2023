import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { redirect, typedjson, useTypedLoaderData } from 'remix-typedjson'

import { MazeView } from '~/components/Maze'
import { getGameStatusForPlayer } from '~/lib/api/@generated/framboos'
import { isLoggedIn } from '~/services/auth.server'

export const meta: MetaFunction = () => {
  return [
    { title: 'Vrolijke Framboos | 2023' },
    { name: 'description', content: 'Los het doolhof op!' },
  ]
}

const testMaze = 20

export async function loader({ request }: LoaderFunctionArgs) {
  if (!(await isLoggedIn(request))) {
    return redirect('/player')
  }

  const { maze, players } = await getGameStatusForPlayer({
    playerId: String(testMaze),
  })

  return typedjson({ maze, players })
}

export default function Index() {
  const { maze, players } = useTypedLoaderData<typeof loader>()

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      <h1 className="text-3xl font-bold text-blue-900 underline">
        Vrolijke Framboos
      </h1>
      <div className="flex justify-center">
        <MazeView maze={maze} players={players} />
      </div>
    </div>
  )
}
