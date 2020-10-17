import React, {useState, useEffect} from 'react'
import PlayerCard from './components/PlayerCard'
import socket from '../../helpers/socket'
import { Button } from 'react-bootstrap'


function LobbyPage (props) {
    console.log(props, "<<< ini props")
    // let proppedPlayers = props.location.state.roomCode.players
    let roomCode = props.location.state.roomCode.code
    const [players, setPlayers] = useState([])
    // console.log(roomCode, 'ini roomCode di lobbyoage')
    console.log(players, 'ini players di lobby')

    useEffect(() => {
        setPlayers(props.location.state.roomCode.players)
    }, [players])

    useEffect(() => {
        socket.on("joined", async (res) => {
            setPlayers(res.players)
        });
    
        return () => socket.disconnect();
      });

    // console.log(host, "<<< ini host" )

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