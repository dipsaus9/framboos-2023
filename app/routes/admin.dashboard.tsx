import { Form, Link, useFetcher } from '@remix-run/react'
import { typedjson, useTypedLoaderData } from 'remix-typedjson'

import {
  getGameSettings,
  getPlayers,
  getTournamentState,
} from '~/lib/api/@generated/framboos'

export async function loader() {
  const tournamentPromise = getTournamentState().catch(() => null)
  const playersPromise = getPlayers()
  const gameSettingsPromise = getGameSettings()

  const [tournament, players, gameSettings] = await Promise.all([
    tournamentPromise,
    playersPromise,
    gameSettingsPromise,
  ])

  return typedjson({
    tournament,
    players,
    gameSettings,
  })
}

export default function Dashboard() {
  const { tournament, players, gameSettings } =
    useTypedLoaderData<typeof loader>()

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

  const createUpdateSettings = (type: string) => (data: any) => {
    submit(
      {
        type,
        ...data,
      },
      {
        action: '/admin/actions/setting/change',
        method: 'POST',
        encType: 'application/json',
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
                <p>Tournament state: {tournament.tournamentState}</p>
                {tournament.game ? (
                  <>
                    <p>Game ID: {tournament.game.gameId}</p>
                    <p>Phase: {tournament.game.phase}</p>
                    <p>Round: {tournament.round}</p>
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
                  onClick={resetTournament}
                  className=" cursor-pointer rounded-md  bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-auto disabled:bg-gray-600"
                >
                  Reset Games
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
        <div className="border-b border-gray-900/10 pb-12">
          <Form>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Game settings
            </h2>
            <div className="my-10">
              <label htmlFor="customRange1" className=" mb-2 inline-block">
                Maze size
              </label>
              <input
                type="range"
                className="h-[4px] w-full cursor-pointer appearance-none border-transparent bg-neutral-200 dark:bg-neutral-600"
                min="5"
                defaultValue={gameSettings.mazeSize}
                onMouseUp={(e) => {
                  createUpdateSettings('mazeSize')({
                    size: e.currentTarget.value,
                  })
                }}
                max="100"
                id="customRange1"
              />
              <p className="mt-2">
                <strong>Value:</strong> {gameSettings.mazeSize}
              </p>
            </div>
            <div className="my-10">
              <label htmlFor="customRange1" className=" mb-2 inline-block">
                Rounds per tournament
              </label>
              <input
                type="range"
                min="1"
                max="100"
                onMouseUp={(e) => {
                  createUpdateSettings('roundsPerTournament')({
                    roundsPerTournament: e.currentTarget.value,
                  })
                }}
                defaultValue={gameSettings.roundsPerTournament}
                className="h-[4px] w-full cursor-pointer appearance-none border-transparent bg-neutral-200 dark:bg-neutral-600"
                id="customRange1"
              />
              <p className="mt-2">
                <strong>Value:</strong> {gameSettings.roundsPerTournament}
              </p>
            </div>
            <div className="my-10">
              <label htmlFor="customRange1" className=" mb-2 inline-block">
                Timing settings - Idle timeout
              </label>
              <input
                type="range"
                min="100"
                max="1000"
                onMouseUp={(e) => {
                  createUpdateSettings('time')({
                    idleTimeoutMs: e.currentTarget.value,
                    explorationMoveIntervalMs:
                      gameSettings.timing.explorationMoveIntervalMs,
                    speedRunMoveIntervalMs:
                      gameSettings.timing.speedRunMoveIntervalMs,
                  })
                }}
                defaultValue={gameSettings.timing.idleTimeoutMs}
                className="h-[4px] w-full cursor-pointer appearance-none border-transparent bg-neutral-200 dark:bg-neutral-600"
                id="customRange1"
              />
              <p className="my-2">
                <strong>Value:</strong> {gameSettings.timing.idleTimeoutMs}
              </p>
            </div>
            <div className="my-10">
              <label htmlFor="customRange1" className=" mb-2 inline-block">
                Timing settings - explorationMoveIntervalMs
              </label>
              <input
                type="range"
                min="100"
                max="1000"
                onMouseUp={(e) => {
                  createUpdateSettings('time')({
                    idleTimeoutMs: gameSettings.timing.idleTimeoutMs,
                    explorationMoveIntervalMs: e.currentTarget.value,
                    speedRunMoveIntervalMs:
                      gameSettings.timing.speedRunMoveIntervalMs,
                  })
                }}
                defaultValue={gameSettings.timing.explorationMoveIntervalMs}
                className="h-[4px] w-full cursor-pointer appearance-none border-transparent bg-neutral-200 dark:bg-neutral-600"
                id="customRange1"
              />
              <p className="my-2">
                <strong>Value:</strong>{' '}
                {gameSettings.timing.explorationMoveIntervalMs}
              </p>
            </div>
            <div className="my-10">
              <label htmlFor="customRange1" className=" mb-2 inline-block">
                Timing settings - speedRunMoveIntervalMs
              </label>
              <input
                type="range"
                min="100"
                max="1000"
                onMouseUp={(e) => {
                  createUpdateSettings('time')({
                    idleTimeoutMs: gameSettings.timing.idleTimeoutMs,
                    explorationMoveIntervalMs:
                      gameSettings.timing.explorationMoveIntervalMs,
                    speedRunMoveIntervalMs: e.currentTarget.value,
                  })
                }}
                defaultValue={gameSettings.timing.speedRunMoveIntervalMs}
                className="h-[4px] w-full cursor-pointer appearance-none border-transparent bg-neutral-200 dark:bg-neutral-600"
                id="customRange1"
              />
              <p className="my-2">
                <strong>Value:</strong>{' '}
                {gameSettings.timing.speedRunMoveIntervalMs}
              </p>
            </div>
            <div className="my-10">
              <label htmlFor="customRange1" className=" mb-2 inline-block">
                Scoring - pointsPerExploration
              </label>
              <input
                type="range"
                min="1"
                max="100"
                onMouseUp={(e) => {
                  createUpdateSettings('points')({
                    pointsPerExploration: e.currentTarget.value,
                    maxPointsForSpeedRunning:
                      gameSettings.scoring.maxPointsForSpeedRunning,
                  })
                }}
                defaultValue={gameSettings.scoring.pointsPerExploration}
                className="h-[4px] w-full cursor-pointer appearance-none border-transparent bg-neutral-200 dark:bg-neutral-600"
                id="customRange1"
              />
              <p className="my-2">
                <strong>Value:</strong>{' '}
                {gameSettings.scoring.pointsPerExploration}
              </p>
            </div>
            <div className="my-10">
              <label htmlFor="customRange1" className=" mb-2 inline-block">
                Scoring - maxPointsForSpeedRunning
              </label>
              <input
                type="range"
                min="1"
                max="300"
                onMouseUp={(e) => {
                  createUpdateSettings('points')({
                    pointsPerExploration:
                      gameSettings.scoring.pointsPerExploration,
                    maxPointsForSpeedRunning: e.currentTarget.value,
                  })
                }}
                defaultValue={gameSettings.scoring.maxPointsForSpeedRunning}
                className="h-[4px] w-full cursor-pointer appearance-none border-transparent bg-neutral-200 dark:bg-neutral-600"
                id="customRange1"
              />
              <p className="my-2">
                <strong>Value:</strong>{' '}
                {gameSettings.scoring.maxPointsForSpeedRunning}
              </p>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}
