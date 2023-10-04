import type { MetaFunction } from '@remix-run/node'

import { MazeView, type Maze } from '~/components/Maze'

export const meta: MetaFunction = () => {
  return [
    { title: 'Vrolijke Framboos | 2023' },
    { name: 'description', content: 'Los het doolhof op!' },
  ]
}

const maze: Maze = {
  size: 25,
  cells: [
    [
      {
        walls: ['Up', 'Left', 'Right'],
      },
      {
        walls: ['Up', 'Left'],
      },
      {
        walls: ['Up', 'Down'],
      },
      {
        walls: ['Up', 'Down', 'Right'],
      },
      {
        walls: ['Up', 'Left', 'Right'],
      },
    ],
    [
      {
        walls: ['Left', 'Right'],
      },
      {
        walls: ['Down', 'Left'],
      },
      {
        walls: ['Up', 'Right'],
      },
      {
        walls: ['Up', 'Left'],
      },
      {
        walls: ['Down', 'Right'],
      },
    ],
    [
      {
        walls: ['Down', 'Left'],
      },
      {
        walls: ['Up'],
      },
      {
        walls: ['Down', 'Right'],
      },
      {
        walls: ['Left'],
      },
      {
        walls: ['Up', 'Right'],
      },
    ],
    [
      {
        walls: ['Up', 'Left'],
      },
      {
        walls: ['Down'],
      },
      {
        walls: ['Up'],
      },
      {
        walls: ['Down', 'Right'],
      },
      {
        walls: ['Left', 'Right'],
      },
    ],
    [
      {
        walls: ['Down', 'Left', 'Right'],
      },
      {
        walls: ['Up', 'Down', 'Left'],
      },
      {
        walls: ['Down', 'Right'],
      },
      {
        walls: ['Up', 'Down', 'Left'],
      },
      {
        walls: ['Down', 'Right'],
      },
    ],
  ],
}

export default function Index() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      <h1 className="text-3xl font-bold text-blue-900 underline">
        Vrolijke Framboos
      </h1>
      <MazeView maze={maze} />
    </div>
  )
}
