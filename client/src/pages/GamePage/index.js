import React, {useEffect, useState} from 'react'

import Board2Players from './components/Board2Players'
import Board3Players from './components/Board3Players'
import Board4Players from './components/Board4Players'
import PlayerComputer from './components/PlayerComputer'

function GamePage(props) {
  const [display, setDisplay] = useState('')

  const players = props?.location?.state?.playersData
  const code = props?.location?.state?.roomCode


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
          <Board2Players handleDisplay={handleSetDisplay}/>
      </div>
    </div>
  )
}

export default GamePage
