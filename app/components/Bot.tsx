import { useCallback } from 'react'

import { useTypedFetcher } from 'remix-typedjson'

import { usePolling } from '~/hooks/usePolling'
import {
  GameStateDTOWallsItem,
  MoveRequestDirection,
  type GameStateDTO,
  type Player,
} from '~/lib/api/@generated/framboos.schemas'
import { POLLING_INTERVAL } from '~/lib/POLLING_INTERVAL'
import type { action as CreatePlayerAction } from '~/routes/admin.actions.player.create'
import type { action as GetGameAction } from '~/routes/admin.actions.player.get-game'
import type { action as MovePlayer } from '~/routes/admin.actions.player.move'

interface BotProps {
  bot: Player | null
  isRegistered: boolean
  botName: string
}

export function Bot({ bot, isRegistered, botName }: BotProps) {
  const difficulty = 'medium'

  const { submit: getGame, data } = useTypedFetcher<typeof GetGameAction>()
  const { submit: movePlayer } = useTypedFetcher<typeof MovePlayer>()
  const { submit: submitCreatePlayer } =
    useTypedFetcher<typeof CreatePlayerAction>()

  const createNewBot = () => {
    const formData = new FormData()

    formData.append('name', botName)
    formData.append('password', 'password')
    formData.append('emojiAlias', 'robot')

    submitCreatePlayer(formData, {
      action: '/admin/actions/player/create',
      method: 'POST',
      preventScrollReset: true,
    })
  }

  const removeBot = useCallback(() => {
    if (!bot?.id) {
      return
    }

    getGame(
      {
        playerId: bot.id,
      },
      {
        action: '/admin/actions/player/remove',
        method: 'POST',
        preventScrollReset: true,
      },
    )
  }, [bot?.id, getGame])

  const getPlayer = useCallback(() => {
    if (!bot?.id) {
      return
    }

    getGame(
      { playerId: bot.id },
      {
        action: '/admin/actions/player/get-game',
        method: 'POST',
        encType: 'application/json',
      },
    )
  }, [bot?.id, getGame])

  const move = useCallback(() => {
    if (data?.game && data.game.gameId && bot?.id) {
      const direction = getDirection(difficulty, data.game)

      movePlayer(
        {
          gameId: data.game.gameId,
          playerId: bot.id,
          direction,
        },
        {
          action: '/admin/actions/player/move',
          method: 'POST',
          encType: 'application/json',
        },
      )
    }
  }, [bot?.id, data?.game, movePlayer])

  usePolling(move, POLLING_INTERVAL)
  usePolling(getPlayer, POLLING_INTERVAL)

  return (
    <div>
      <div className="mt-10 grid">
        <div className="flex items-start justify-start gap-x-6">
          <p>
            {isRegistered && bot
              ? `Bot is registered:  ${bot.id}`
              : 'Bot is not registered'}
          </p>
        </div>
        <div className="my-10 flex items-start justify-start gap-x-6">
          <button
            type="button"
            disabled={isRegistered}
            onClick={createNewBot}
            className=" cursor-pointer rounded-md  bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-auto disabled:bg-gray-600"
          >
            Create new Bot
          </button>
          <button
            type="button"
            disabled={!isRegistered}
            onClick={removeBot}
            className=" cursor-pointer rounded-md  bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-auto disabled:bg-gray-600"
          >
            Delete bot
          </button>
        </div>
      </div>
    </div>
  )
}

function getDirection(
  difficulty: 'easy' | 'medium',
  game: GameStateDTO,
): MoveRequestDirection {
  // Get direction based on keys of MoveRequestDirection const

  switch (difficulty) {
    case 'easy':
      return getRandomMove()
    case 'medium':
      return getDirectionBasedOnMaze(game)
    default:
      return getRandomMove()
  }
}

function getRandomMove(): MoveRequestDirection {
  return Object.keys(MoveRequestDirection)[
    Math.floor(Math.random() * Object.keys(MoveRequestDirection).length)
  ] as MoveRequestDirection
}

let mazeBuilder: Record<
  string,
  Map<
    string,
    {
      walls: GameStateDTOWallsItem[]
      currentPosition: {
        x: number
        y: number
      }
      directionsTried: MoveRequestDirection[]
      timesTried: number
    }
  >
> = {}

function getDirectionBasedOnOptions(game: GameStateDTO) {
  const possibleMoves = Object.keys(GameStateDTOWallsItem).filter(
    (direction) => !game.walls?.includes(direction as GameStateDTOWallsItem),
  )

  if (possibleMoves.length === 0) {
    // No possible moves, go random
    return getRandomMove()
  }

  const direction = possibleMoves[
    Math.floor(Math.random() * possibleMoves.length)
  ] as MoveRequestDirection

  return direction
}

function getDirectionBasedOnMaze(game: GameStateDTO) {
  const direction = getDirectionBasedOnOptions(game)

  const currentPosition = `${game.position?.x},${game.position?.y}`

  if (game.gameId) {
    if (game.gamePhase === 'SpeedRunning') {
      if (mazeBuilder[game.gameId]) {
        if (mazeBuilder[game.gameId].has(currentPosition)) {
          const situation = mazeBuilder[game.gameId].get(currentPosition)

          const move = situation?.directionsTried[
            Math.floor(Math.random() * situation?.directionsTried.length)
          ] as MoveRequestDirection

          return move
        }
      }
    }

    if (!mazeBuilder[game.gameId]) {
      mazeBuilder[game.gameId] = new Map()
    }

    if (!mazeBuilder[game.gameId].has(currentPosition)) {
      mazeBuilder[game.gameId].set(currentPosition, {
        walls: game.walls!,
        currentPosition: {
          x: game.position?.x ?? 0,
          y: game.position?.y ?? 0,
        },
        directionsTried: [direction],
        timesTried: 0,
      })

      const newPosition = getNewPosition(
        game.position?.x ?? 0,
        game.position?.y ?? 0,
        direction,
      )

      const newCurrentPosition = `${newPosition.x},${newPosition.y}`

      if (mazeBuilder[game.gameId].has(newCurrentPosition)) {
        const oldPosition = mazeBuilder[game.gameId].get(currentPosition)!

        if (oldPosition.timesTried > 20) {
          return direction
        }

        mazeBuilder[game.gameId].set(currentPosition, {
          ...oldPosition,
          timesTried: oldPosition.timesTried + 1,
        })

        return getDirectionBasedOnMaze(game)
      }
    } else {
      if (mazeBuilder[game.gameId]) {
        if (
          mazeBuilder[game.gameId]
            .get(currentPosition)
            ?.directionsTried.includes(direction)
        ) {
          const oldPosition = mazeBuilder[game.gameId].get(currentPosition)!

          if (oldPosition.timesTried > 20) {
            return direction
          }

          mazeBuilder[game.gameId].set(currentPosition, {
            ...oldPosition,
            timesTried: oldPosition.timesTried + 1,
          })

          return getDirectionBasedOnMaze(game)
        } else {
          const oldPosition = mazeBuilder[game.gameId].get(currentPosition)!
          const oldDirectionsTried = oldPosition.directionsTried

          oldDirectionsTried.push(direction)

          mazeBuilder[game.gameId].set(currentPosition, {
            ...oldPosition,
            directionsTried: oldDirectionsTried,
          })
        }
      }
    }
  }

  return direction
}

function getNewPosition(
  currentX: number,
  currentY: number,
  direction: MoveRequestDirection,
) {
  switch (direction) {
    case 'Up':
      return {
        x: currentX,
        y: currentY - 1,
      }
    case 'Down':
      return {
        x: currentX,
        y: currentY + 1,
      }
    case 'Left':
      return {
        x: currentX - 1,
        y: currentY,
      }
    case 'Right':
      return {
        x: currentX + 1,
        y: currentY,
      }
    default:
      return {
        x: currentX,
        y: currentY,
      }
  }
}
