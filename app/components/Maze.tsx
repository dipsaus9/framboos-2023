import { useEffect, useRef } from 'react'

export type WallDirection = 'Up' | 'Down' | 'Left' | 'Right'

export interface Cell {
  walls: Array<WallDirection>
}

export interface Maze {
  size: number
  cells: Array<Array<Cell>>
}

const CANVAS_BASE_SIZE = 800

function drawLine(
  ctx: CanvasRenderingContext2D,
  sX: number,
  sY: number,
  eX: number,
  eY: number,
) {
  /*Draw a line from the starting X and Y positions to  the ending X and Y positions*/
  ctx.moveTo(sX, sY)
  ctx.lineTo(eX, eY)
}

function drawCell(
  ctx: CanvasRenderingContext2D,
  size: number,
  x: number,
  y: number,
  walls: Array<WallDirection>,
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

function drawBase(
  ctx: CanvasRenderingContext2D,
  maze: Maze,
  fullScreen: boolean,
) {
  /* Draw the tiles on the canvas*/
  const size = fullScreen ? CANVAS_BASE_SIZE / maze.size : (maze.size * 5) / 2

  for (let i = 0; i < maze.cells.length; i++) {
    const cells = maze.cells[i]

    for (let j = 0; j < cells.length; j++) {
      drawCell(ctx, size, i * size, j * size, maze.cells[j][i].walls)
    }
  }
}

function clearCanvas(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

interface MazeProps {
  maze: Maze
  fullScreen?: boolean
}

export function MazeView({ maze, fullScreen = true }: MazeProps) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current

    if (!canvas) {
      return
    }

    const ctx = canvas.getContext('2d')

    if (ctx) {
      drawBase(ctx, maze, fullScreen)

      return () => {
        clearCanvas(ctx, canvas)
      }
    }
  }, [fullScreen, maze])

  const canvasSize = fullScreen ? CANVAS_BASE_SIZE : (maze.size * 5) / 2

  return <canvas ref={ref} width={canvasSize} height={canvasSize} />
}
