import { useRevalidator } from '@remix-run/react'

import { usePolling } from '~/hooks/usePolling'
import type { TournamentDTO } from '~/lib/api/@generated/framboos.schemas'
import { POLLING_INTERVAL } from '~/lib/POLLING_INTERVAL'

import { MazeView } from './Maze'
import {TournamentDTOTournamentState} from "~/lib/api/@generated/framboos.schemas";

interface TournamentViewProps {
  tournament: TournamentDTO
}

export function TournamentView({ tournament }: TournamentViewProps) {
  const revalidator = useRevalidator()

  usePolling(() => {
    if (revalidator.state === 'idle') {
      revalidator.revalidate()
    }
  }, POLLING_INTERVAL)

  if (tournament.tournamentState !== TournamentDTOTournamentState.Playing) {
    return <p>Waiting for players to be ready...</p>
  }

  if (!tournament.game?.maze || !tournament.game?.players) {
    return <p>Something went wrong</p>
  }

  return (
    // Render score board here
    <MazeView maze={tournament.game?.maze} players={tournament.game?.players} />
  )
}
