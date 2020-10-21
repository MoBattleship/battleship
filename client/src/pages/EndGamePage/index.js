import React from 'react'
import { Button } from 'react-bootstrap'
import LosePage from './components/losePage'
import WinPage from './components/winPage'

function endGamePage(props) {
    const status = props.location.state.status
    const playerData = props.location.state.playerData
    return (
        <div className="container">
            {status === 'winner'?<WinPage name={playerData.name}/>:<LosePage name={playerData.name}/>}
        </div>
    )
}

export default endGamePage