import { useLayoutEffect, useRef } from 'react'

export type WallDirection = 'Up' | 'Down' | 'Left' | 'Right'

export interface Cell {
  walls: Array<WallDirection>
}

export interface Maze {
  size: number
  cells: Array<Array<Cell>>
}

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

function drawBase(ctx: CanvasRenderingContext2D, maze: Maze) {
  /* Draw the tiles on the canvas*/
  const size = maze.size * 4

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
}

export function MazeView({ maze }: MazeProps) {
  const ref = useRef<HTMLCanvasElement>(null)

  useLayoutEffect(() => {
    const canvas = ref.current

    if (!canvas) {
      return
    }

    const ctx = canvas.getContext('2d')

    if (ctx) {
      drawBase(ctx, maze)

      return () => {
        clearCanvas(ctx, canvas)
      }
    }
  }, [maze])

  return <canvas ref={ref} width={maze.size * 20} height={maze.size * 20} />
}
