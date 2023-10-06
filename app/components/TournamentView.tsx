import { useMemo } from 'react'

import { useRevalidator } from '@remix-run/react'
import Confetti from 'react-confetti'

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
  const { width, height } = useMemo(() => {
    if (typeof window === 'undefined') {
      return {
        width: 1920,
        height: 1080,
      }
    }

    return {
      width: window.innerWidth,
      height: window.innerHeight,
    }
  }, [])

  usePolling(() => {
    if (revalidator.state === 'idle') {
      revalidator.revalidate()
    }
  }, POLLING_INTERVAL)

  if (tournament?.tournamentState === TournamentDTOTournamentState.Waiting) {
    return (
      <h1 className="text-5xl font-semibold leading-7 text-gray-900">
        Waiting for game to start
      </h1>
    )
  }

  if (tournament?.tournamentState === TournamentDTOTournamentState.Finished) {
    return (
      <>
        <h1 className="text-5xl font-semibold leading-7 text-gray-900">
          Scoreboard
        </h1>
        <table className="text-left text-sm font-light">
          <thead className="border-b border-b-black font-medium dark:border-neutral-500">
            <tr>
              <th className="max-w-md p-4">Emoji</th>
              <th className="max-w-md p-4">Name</th>
              <th className="p-4">Score</th>
            </tr>
          </thead>
          <tbody>
            {tournament?.ranking.map((rank) => (
              <tr
                key={rank.playerId}
                className="bg-neutral-400 bg-opacity-25 odd:bg-neutral-600 odd:bg-opacity-25"
              >
                <td className="whitespace-nowrap p-4">{rank.playerEmoji}</td>

                <td className="truncate whitespace-nowrap px-2">
                  {rank.playerName}
                </td>

                <td className="whitespace-nowrap p-4 hover:underline">
                  {rank.score}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Confetti width={width} height={height} />
      </>
    )
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
      <div className="flex items-start justify-start">
        <table className="text-left text-sm font-light">
          <thead className="border-b border-b-black font-medium dark:border-neutral-500">
            <tr>
              <th className="p-4" />
              <th className="max-w-md p-4">Name</th>
              <th className="p-4">Moves</th>
              <th className="p-4">Position</th>
              <th className="p-4">Score</th>
            </tr>
          </thead>
          <tbody>
            {tournament?.game?.players.map((player) => (
              <tr
                key={player.playerId}
                className="bg-neutral-400 bg-opacity-25 odd:bg-neutral-600 odd:bg-opacity-25"
              >
                <td className="whitespace-nowrap p-4">{player.emoji}</td>

                <td className="truncate whitespace-nowrap px-2">
                  {player.name}
                </td>
                <td className="whitespace-nowrap p-4 hover:underline">
                  {player.nrOfMoves}
                </td>
                <td className="whitespace-nowrap p-4 hover:underline">
                  {`${player.position.x}, ${player.position.y}`}
                </td>
                <td className="whitespace-nowrap p-4 hover:underline">
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
      </div>
    </>
  )
}
