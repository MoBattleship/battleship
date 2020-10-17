import React, { useState, useEffect } from 'react'
import socket from '../helpers/socket'
import { useHistory } from 'react-router-dom'


function HomePage () {
    const [name, setName] = useState("")
    const [roomCode, setRoomCode] = useState("")
    const history = useHistory()

    
    const handleInputName = (event) => {
        setName(event.target.value)
    }

    const handleHost = () => {
        console.log(name, 'ini name yg dikirim ke server')
        socket.emit("host", {name})
        
    }

    useEffect(() => {
        socket.on("hostResponse", async ( res ) => {
            console.log(res.players, 'ini response server')
            await setRoomCode(JSON.parse(JSON.stringify(res)))
            console.log(roomCode, 'ini roomCode')
            // history.push('/lobby', {roomCode})
        })

        return () => socket.disconnect();
    }, [])

    useEffect(() => {
        if (roomCode !== "") {
            history.push('/lobby', {roomCode})
        }
    }, [roomCode])
    return (
        <div>
            <div className="splash-container">
                <img src="./images/sunset.svg" alt="logo" />
                <div className="splash-form">
                    <h2>Input Your Name</h2><br />
                    <input type="text" className="input-form" onChange={handleInputName} value={name} /><br />
                </div>< br/>
                <div>
                    <button className="button splash-btn" onClick={handleHost}>HOST</button>
                    <button className="button splash-btn">JOIN</button>
                </div>
            </div>
        </div>
    )
}

export default HomePage