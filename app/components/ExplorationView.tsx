import { useCallback, useEffect, useState } from 'react'

import { useRevalidator } from '@remix-run/react'
import { useTypedFetcher } from 'remix-typedjson'

import { usePolling } from '~/hooks/usePolling'
import type { Player } from '~/lib/api/@generated/framboos.schemas'
import { POLLING_INTERVAL } from '~/lib/POLLING_INTERVAL'
import type { loader } from '~/routes/admin.loaders.player.get'

import { MazeView } from './Maze'

interface ExplorationViewProps {
  players: Player[]
}

export function ExplorationView({ players }: ExplorationViewProps) {
  const [activePlayerIndex, setActivePlayerIndex] = useState(0)
  const revalidator = useRevalidator()

  // Switch to the next player every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePlayerIndex((index) => (index + 1) % players.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [players.length])

  const activePlayer = players[activePlayerIndex]

  const { submit, data } = useTypedFetcher<typeof loader>()

  const getMaze = useCallback(() => {
    if (activePlayer?.id) {
      submit(
        {
          playerId: activePlayer.id,
        },
        {
          action: '/admin/loaders/player/get',
          method: 'GET',
        },
      )
    }

    // if (revalidator.state === 'idle') {
    revalidator.revalidate()
    // }
  }, [activePlayer?.id, revalidator, submit])

  usePolling(getMaze, POLLING_INTERVAL)

  if (!data || !data.maze || !data.players?.length) {
    return <p>Waiting for players to join the game...</p>
  }

  return (
    <div className="flex">
      <table className="text-left text-sm font-light">
        <thead className="border-b border-b-black font-medium dark:border-neutral-500">
          <tr>
            <th className="px-6 py-4">Emoji</th>
            <th className="max-w-md px-6 py-4">Name</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr
              key={player.id}
              className={`bg-neutral-400 bg-opacity-25 odd:bg-neutral-600 odd:bg-opacity-25 ${
                player.id === activePlayer.id ? 'font-bold' : ''
              }`}
            >
              <td className="whitespace-nowrap px-6 py-4">{player.emoji}</td>
              <td className="max-w-md truncate whitespace-nowrap px-6 py-4">
                {player.name}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <MazeView maze={data.maze} players={data.players} />
    </div>
  )
}
