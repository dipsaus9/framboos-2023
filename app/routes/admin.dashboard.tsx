import { Form, Link, useFetcher } from '@remix-run/react'
import { typedjson, useTypedLoaderData } from 'remix-typedjson'

import { getPlayers, getTournamentState } from '~/lib/api/@generated/framboos'

export async function loader() {
  const tournamentPromise = getTournamentState().catch(() => null)
  const playersPromise = getPlayers()

  const [tournament, players] = await Promise.all([
    tournamentPromise,
    playersPromise,
  ])

  return typedjson({ tournament, players })
}

export default function Dashboard() {
  const { tournament, players } = useTypedLoaderData<typeof loader>()

  const { submit } = useFetcher()

  const nextRound = () => {
    submit(null, {
      action: '/admin/actions/tournament/proceed',
      method: 'POST',
      preventScrollReset: true,
    })
  }

  const resetTournament = () => {
    submit(null, {
      action: '/admin/actions/tournament/reset',
      method: 'POST',
      preventScrollReset: true,
    })
  }

  const newTournament = () => {
    submit(null, {
      action: '/admin/actions/tournament/new',
      method: 'POST',
      preventScrollReset: true,
    })
  }

  const createRemovePlayer = (playerId: string) => () => {
    submit(
      {
        playerId,
      },
      {
        action: '/admin/actions/player/remove',
        method: 'POST',
        preventScrollReset: true,
      },
    )
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center justify-center py-10">
      <div className="space-y-12">
        <h1 className="text-5xl font-semibold leading-7 text-gray-900">
          Dashboard
        </h1>
        <div className="border-b border-gray-900/10 pb-12">
          <Form action="/admin/actions/tournament/proceed" method="POST">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Tournament information
            </h2>
            {tournament ? (
              <>
                <p>Tournament state: {tournament.tournament.state}</p>
                {tournament.game ? (
                  <>
                    <p>Game ID: {tournament.game.gameId}</p>
                    <p>Phase: {tournament.game.phase}</p>
                    {/* @ts-expect-error */}
                    <p>Round: {tournament.tournament.round}</p>
                    <p>
                      Total amount of players: {tournament.game.players.length}
                    </p>
                  </>
                ) : null}
              </>
            ) : (
              'No tournament yet'
            )}
            <div className="mt-10 grid">
              <div className="flex items-start justify-start gap-x-6">
                <button
                  type="button"
                  disabled={!tournament}
                  onClick={resetTournament}
                  className=" cursor-pointer rounded-md  bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-auto disabled:bg-gray-600"
                >
                  Reset Tournament
                </button>
                <button
                  type="button"
                  disabled={!tournament}
                  className=" cursor-pointer rounded-md  bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-auto disabled:bg-gray-600"
                  onClick={nextRound}
                >
                  Next round
                </button>

                <button
                  type="button"
                  className=" cursor-pointer rounded-md  bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-auto disabled:bg-gray-600"
                  onClick={newTournament}
                >
                  Create new tournament
                </button>
              </div>
            </div>
          </Form>
        </div>
        <div className="border-b border-gray-900/10 pb-12">
          <Form action="/admin/actions/tournament/proceed" method="POST">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Player information
            </h2>
            {players.length ? (
              <>
                <table className="min-w-full text-left text-sm font-light">
                  <thead className="border-b border-b-black font-medium dark:border-neutral-500">
                    <tr>
                      <th className="px-6 py-4">Emoji</th>
                      <th className="max-w-md px-6 py-4">Name</th>
                      <th className="px-6 py-4">Link to game</th>
                      <th className="px-6 py-4">Delete Player</th>
                    </tr>
                  </thead>
                  <tbody>
                    {players.map((player) => (
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
                          <Link target="_blank" to={`/player/${player.id}`}>
                            Game Link
                          </Link>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-red-600 hover:underline">
                          <button
                            type="button"
                            onClick={createRemovePlayer(player.id)}
                          >
                            Delete player
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              'No players yet'
            )}
          </Form>
        </div>
      </div>
    </div>
  )
}
