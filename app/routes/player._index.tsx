import type { MetaFunction } from '@remix-run/node'
import { Link } from '@remix-run/react'
import { typedjson, useTypedLoaderData } from 'remix-typedjson'

import { getPlayers } from '~/lib/api/@generated/framboos'

export const meta: MetaFunction = () => {
  return [
    { title: 'Vrolijke Framboos | 2023' },
    { name: 'description', content: 'Los het doolhof op!' },
  ]
}

export async function loader() {
  const isGameInTournamentMode = false

  if (isGameInTournamentMode) {
    throw new Response(null, {
      status: 404,
      statusText: 'Game is in tournament mode',
    })
  }

  const allPlayers = await getPlayers().catch(() => {
    throw new Response(null, {
      status: 500,
      statusText: 'Could not find any players',
    })
  })

  if (!allPlayers) {
    throw new Response(null, {
      status: 500,
      statusText: 'Could not find any players',
    })
  }

  return typedjson({ allPlayers })
}

export default function PlayerView() {
  const { allPlayers } = useTypedLoaderData<typeof loader>()

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      <div className="flex flex-col items-center">
        <div className="my-10 flex flex-col items-center justify-center">
          <h1 className=" mb-0 text-3xl font-bold text-blue-900">
            Player overview
          </h1>
        </div>
        <table className="min-w-full text-left text-sm font-light">
          <thead className="border-b font-medium dark:border-neutral-500">
            <tr>
              <th className="px-6 py-4">Emoji</th>
              <th className="max-w-md px-6 py-4">Name</th>
              <th className="px-6 py-4">Link</th>
            </tr>
          </thead>
          <tbody>
            {allPlayers.map((player) => (
              <tr key={player.id}>
                <td className="whitespace-nowrap px-6 py-4">{player.emoji}</td>

                <td className="max-w-md truncate whitespace-nowrap px-6 py-4">
                  {player.name}
                </td>
                <td className="whitespace-nowrap px-6 py-4 hover:underline">
                  <Link to={`/player/${player.id}`}>Link</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
