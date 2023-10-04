import { useCallback, useEffect, useState } from 'react'

import { useTypedFetcher } from 'remix-typedjson'

import { usePolling } from '~/hooks/usePolling'
import type { Player } from '~/lib/api/@generated/framboos.schemas'
import { POLLING_INTERVAL } from '~/lib/POLLING_INTERVAL'
import type { loader } from '~/routes/loader.player.get-maze'

import { MazeView } from './Maze'

interface ExplorationViewProps {
  players: Player[]
}

export function ExplorationView({ players }: ExplorationViewProps) {
  const [activePlayerIndex, setActivePlayerIndex] = useState(0)

  // Switch to the next player every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePlayerIndex((index) => (index + 1) % players.length)
    }, 50000)

    return () => clearInterval(interval)
  }, [players.length])

  const activePlayer = players[activePlayerIndex]

  const { submit, data } = useTypedFetcher<typeof loader>()

  const getMaze = useCallback(() => {
    const formData = new FormData()

    formData.append('playerId', activePlayer.id)

    submit(formData, {
      action: '/loader/player/get-maze',
      method: 'GET',
    })
  }, [activePlayer.id, submit])

  usePolling(getMaze, POLLING_INTERVAL)

  if (!data || !data.maze || !data.players?.length) {
    return <p>Loading...</p>
  }

  return <MazeView maze={data.maze} players={data.players} />
}
