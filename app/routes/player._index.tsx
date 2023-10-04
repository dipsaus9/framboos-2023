/* eslint-disable tailwindcss/migration-from-tailwind-2 */
import type { MetaFunction } from '@remix-run/node'
import { Link } from '@remix-run/react'
import { typedjson, useTypedLoaderData } from 'remix-typedjson'

import { getPlayers, getTournamentState } from '~/lib/api/@generated/framboos'

export const meta: MetaFunction = () => {
  return [
    { title: 'Vrolijke Framboos | 2023' },
    { name: 'description', content: 'Los het doolhof op!' },
  ]
}

export async function loader() {
  const tournament = await getTournamentState().catch(() => null)

  const isInTournamentMode = !!tournament

  if (isInTournamentMode) {
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
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="my-10 flex flex-col items-center justify-center">
          <h1 className=" mb-0 text-3xl font-bold text-blue-900">
            Player overview
          </h1>
        </div>
        {allPlayers.length === 0 ? (
          <h3>Go register and play a game!?</h3>
        ) : (
          <table className="min-w-full text-left text-sm font-light">
            <thead className="border-b border-b-black font-medium dark:border-neutral-500">
              <tr>
                <th className="px-6 py-4">Emoji</th>
                <th className="max-w-md px-6 py-4">Name</th>
                <th className="px-6 py-4">Link to game</th>
              </tr>
            </thead>
            <tbody>
              {allPlayers.map((player) => (
                <tr
                  key={player.id}
                  className="bg-neutral-400 bg-opacity-25 odd:bg-neutral-600 odd:bg-opacity-25"
                >
                  <td className="whitespace-nowrap px-6 py-4">
                    {player.emoji}
                  </td>

                  <td className="max-w-md truncate whitespace-nowrap px-6 py-4">
                    {player.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 hover:underline">
                    <Link to={`/player/${player.id}`}>Game Link</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
