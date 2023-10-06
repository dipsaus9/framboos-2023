import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import { redirect, typedjson, useTypedLoaderData } from 'remix-typedjson'

import { ExplorationView } from '~/components/ExplorationView'
import { TournamentView } from '~/components/TournamentView'
import { getPlayers, getTournamentState } from '~/lib/api/@generated/framboos'
import { isLoggedIn } from '~/services/auth.server'

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
        <div className="my-10">
          {isInTournamentMode ? (
            <TournamentView tournament={tournament} />
          ) : (
            <ExplorationView players={players} />
          )}
        </div>
      </div>
    </div>
  )
}
