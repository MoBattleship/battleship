import React from 'react'
import PlayerCard from './components/PlayerCard'
import { Button } from 'react-bootstrap'


function LobbyPage (props) {
    let roomCode = props.location.state.roomCode.code
    console.log(roomCode, 'ini roomCode di lobbyoage')
    let players=[
        {
            name: 'Arrizal'
        },
        {
            name: 'Fariz'
        },
        {
            name: 'Juan'
        },
        {
            name: 'Izra'
        }
    ]
    return (
        <div className="container mt-3">
            <h5>This is your roomcode: {roomCode}</h5>
            <h1 style={{fontFamily: 'Piedra'}}>Waiting Room</h1>
            <div className="container border rounded-lg shadow-sm">
                <div className="row justify-content-center">
                    <h4 style={{fontFamily: 'Piedra'}}>Players List</h4>
                </div>
                <div className="row justify-content-center">
                    {players.map((player, index) => {
                        return (
                            <PlayerCard
                                key={index}
                                playerData={player}
                            ></PlayerCard>
                        )
                    })}
                </div>
                <Button type="button-lg mt-3 mb-3">Start Game</Button>
            </div>
        </div>
    )
}

export default LobbyPage