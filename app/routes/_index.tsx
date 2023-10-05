import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { redirect, typedjson, useTypedLoaderData } from 'remix-typedjson'

import { ExplorationView } from '~/components/ExplorationView'
import { TournamentView } from '~/components/TournamentView'
import { getPlayers, getTournamentState } from '~/lib/api/@generated/framboos'
import { isLoggedIn } from '~/services/auth.server'

import { POLLING_INTERVAL } from '../lib/POLLING_INTERVAL'

export const meta: MetaFunction = () => {
  return [
    { title: 'Vrolijke Framboos | 2023' },
    { name: 'description', content: 'Los het doolhof op!' },
  ]
}

export async function loader({ request }: LoaderFunctionArgs) {
  if (!(await isLoggedIn(request))) {
    return redirect('/player')
  }

  const tournamentPromise = getTournamentState().catch(() => null)

  const allPlayersPromise = getPlayers()

  const [tournament, players] = await Promise.all([
    tournamentPromise,
    allPlayersPromise,
  ])

  const isInTournamentMode = !!tournament

  return typedjson({ isInTournamentMode, players, tournament })
}

export default function Index() {
  const { players, isInTournamentMode, tournament } =
    useTypedLoaderData<typeof loader>()

  return (
    <div className="flex flex-col items-center">
      <div className="my-10 flex flex-col items-center justify-center">
        <h1 className="mb-4 text-3xl font-bold text-blue-900">
          {isInTournamentMode ? 'Vrolijke framboos' : 'Game on!'}
        </h1>
        {isInTournamentMode ? (
          <>
            <table className="min-w-full text-left text-sm font-light">
              <thead className="border-b border-b-black font-medium dark:border-neutral-500">
                <tr>
                  <th className="px-6 py-4">Emoji</th>
                  <th className="max-w-md px-6 py-4">Name</th>
                  <th className="px-6 py-4">Nr of moves</th>
                  <th className="px-6 py-4">Score</th>
                </tr>
              </thead>
              <tbody>
                {tournament?.game?.players.map((player) => (
                  <tr
                    key={player.playerId}
                    className="bg-neutral-400 bg-opacity-25 odd:bg-neutral-600 odd:bg-opacity-25"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      {player.emoji}
                    </td>

                    <td className="max-w-md truncate whitespace-nowrap px-6 py-4">
                      {player.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 hover:underline">
                      {player.nrOfMoves}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 hover:underline">
                      0
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <TournamentView tournament={tournament} />
          </>
        ) : (
          <ExplorationView players={players} />
        )}
      </div>
    </div>
  )
}
