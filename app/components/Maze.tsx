import { useEffect, useRef } from 'react'

import type {
  MazeCellDTOWallsItem,
  MazeDTO,
  PlayerDTO,
} from '~/lib/api/@generated/framboos.schemas'

const CANVAS_BASE_SIZE = 1000

function drawLine(
  ctx: CanvasRenderingContext2D,
  sX: number,
  sY: number,
  eX: number,
  eY: number,
) {
  /*Draw a line from the starting X and Y positions to  the ending X and Y positions*/
  ctx.moveTo(sX, sY)

  ctx.lineCap = 'round'
  ctx.strokeStyle = 'black'
  ctx.lineWidth = 1
  ctx.lineTo(eX, eY)
  ctx.stroke()
}

function drawCell(
  ctx: CanvasRenderingContext2D,
  size: number,
  x: number,
  y: number,
  walls: Array<MazeCellDTOWallsItem>,
) {
  /* Draw cell based on wall properties */
  let left = walls.includes('Left')
  let right = walls.includes('Right')
  let top = walls.includes('Up')
  let bottom = walls.includes('Down')

  ctx.beginPath()

  if (left) {
    drawLine(ctx, x, y, x, y + size)
  }

  if (right) {
    drawLine(ctx, x + size, y, x + size, y + size)
  }

  if (bottom) {
    drawLine(ctx, x, y + size, x + size, y + size)
  }

  if (top) {
    drawLine(ctx, x, y, x + size, y)
  }
  ctx.stroke()
}

function drawBase(ctx: CanvasRenderingContext2D, size: number, maze: MazeDTO) {
  /* Draw the tiles on the canvas*/

  for (let i = 0; i < maze.cells.length; i++) {
    const cells = maze.cells[i]

    for (let j = 0; j < cells.length; j++) {
      drawCell(ctx, size, i * size, j * size, maze.cells[j][i].walls)
    }
  }
}

function drawPlayer(
  ctx: CanvasRenderingContext2D,
  size: number,
  player: PlayerDTO,
) {
  ctx.fillText(
    player.emoji,
    player.position.x * size + size / 2,
    player.position.y * size + size / 2,
  )

  ctx.font = `${size / 2}px serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
}

function drawEndpoint(
  ctx: CanvasRenderingContext2D,
  size: number,
  maze: MazeDTO,
) {
  ctx.fillText(
    '🍇',
    maze.finishingPoint.x * size + size / 2,
    maze.finishingPoint.y * size + size / 2,
  )

  ctx.font = `${size / 2}px serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
}

function clearCanvas(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

interface MazeProps {
  maze: MazeDTO
  fullScreen?: boolean
  players: PlayerDTO[]
}

export function MazeView({ maze, players, fullScreen = true }: MazeProps) {
  const ref = useRef<HTMLCanvasElement>(null)
  const size = fullScreen ? CANVAS_BASE_SIZE / maze.size : (maze.size * 5) / 2

  useEffect(() => {
    const canvas = ref.current

    if (!canvas) {
      return
    }

    const ctx = canvas.getContext('2d')

    if (ctx) {
      drawBase(ctx, size, maze)
      drawEndpoint(ctx, size, maze)

      return () => {
        clearCanvas(ctx, canvas)
      }
    }
  }, [maze, size])

  useEffect(() => {
    const canvas = ref.current

    if (!canvas) {
      return
    }

    const ctx = canvas.getContext('2d')

    if (ctx) {
      players.forEach((player) => drawPlayer(ctx, size, player))

      return () => {
        clearCanvas(ctx, canvas)
      }
    }
  }, [maze, size, players])

  const canvasSize = fullScreen ? CANVAS_BASE_SIZE : (maze.size * 5) / 2

  return <canvas ref={ref} width={canvasSize} height={canvasSize} />
}
