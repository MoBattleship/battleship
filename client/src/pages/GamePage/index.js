import React from 'react'

import Board2Players from './components/Board2Players'
import Board3Players from './components/Board3Players'
import Board4Players from './components/Board4Players'

function GamePage() {
  return (
    <div>
      <Board2Players />
      <Board3Players />
      <Board4Players />
    </div>
  )
}

export default GamePage
