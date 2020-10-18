import React from 'react'

import Board2Players from './components/Board2Players'
import Board3Players from './components/Board3Players'
import Board4Players from './components/Board4Players'
import PlayerComputer from './components/PlayerComputer'

function GamePage() {
  return (
    <div className="row m-5 ">
      <div style={{width: "40%"}}>
        <PlayerComputer />
      </div>
      <div style={{width: "60%"}}>
        <Board2Players />
      </div>
      {/* <Board3Players />
      <Board4Players /> */}
    </div>
  )
}

export default GamePage
