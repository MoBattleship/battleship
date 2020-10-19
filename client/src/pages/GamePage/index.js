import React, {useEffect, useState} from 'react'

import Board2Players from './components/Board2Players'
import Board3Players from './components/Board3Players'
import Board4Players from './components/Board4Players'
import PlayerComputer from './components/PlayerComputer'

function GamePage() {
  const [display, setDisplay] = useState('')

  useEffect(() => {
    
  }, [display])
  const handleSetDisplay = (data) => {
    setDisplay(data)
  }
  return (
    <div className="row m-5 ">
      <div style={{width: "40%"}}>
        {
          display ? <PlayerComputer changeDisplay={display}/> : <PlayerComputer />
        }
      </div>
      <div style={{width: "60%"}}>
        {/* <Board2Players handleDisplay={handleSetDisplay}/> */}
        {/* <Board3Players handleDisplay={handleSetDisplay}/> */}
        <Board4Players handleDisplay={handleSetDisplay}/>
      </div>
    </div>
  )
}

export default GamePage
