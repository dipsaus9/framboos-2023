import { useRevalidator } from '@remix-run/react'

import { usePolling } from '~/hooks/usePolling'
import {
  TournamentDTOTournamentState,
  type TournamentDTO,
} from '~/lib/api/@generated/framboos.schemas'
import { POLLING_INTERVAL } from '~/lib/POLLING_INTERVAL'

import { MazeView } from './Maze'

interface TournamentViewProps {
  tournament: TournamentDTO | null
}

export function TournamentView({ tournament }: TournamentViewProps) {
  const revalidator = useRevalidator()

  usePolling(() => {
    if (revalidator.state === 'idle') {
      revalidator.revalidate()
    }
  }, POLLING_INTERVAL)

  if (tournament?.tournamentState === TournamentDTOTournamentState.Waiting) {
    return <p>Waiting for Game to start...</p>
  }

  if (tournament?.tournamentState === TournamentDTOTournamentState.Finished) {
    return <p>Confetti + Winnaar</p>
  }

  if (!tournament) {
    return null
  }

  if (!tournament.game?.maze || !tournament.game?.players) {
    return <p>Something went wrong, this should not happen</p>
  }

  return (
    <>
      <h2 className="text-base font-semibold leading-7 text-gray-900">
        Tournament information
      </h2>
      {tournament ? (
        <>
          {tournament.game ? (
            <>
              <p>
                <strong>Phase:</strong> {tournament.game.phase}
              </p>
              <p>
                <strong>Round:</strong> {tournament.round}
              </p>
              <p>
                <strong>Total amount of players:</strong>{' '}
                {tournament.game.players.length}
              </p>
            </>
          ) : null}
        </>
      ) : (
        'No tournament yet'
      )}
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
              <td className="whitespace-nowrap px-6 py-4">{player.emoji}</td>

              <td className="max-w-md truncate whitespace-nowrap px-6 py-4">
                {player.name}
              </td>
              <td className="whitespace-nowrap px-6 py-4 hover:underline">
                {player.nrOfMoves}
              </td>
              <td className="whitespace-nowrap px-6 py-4 hover:underline">
                {tournament.ranking.find(
                  (ranking) => ranking.playerId === player.playerId,
                )?.score ?? 0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <MazeView
        maze={tournament.game?.maze}
        players={tournament.game?.players}
      />
    </>
  )
}
