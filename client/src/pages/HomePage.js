import React, { useState, useEffect } from 'react'
import socket from '../helpers/socket'

function HomePage () {
    const [name, setName] = useState("")

    
    const handleInputName = (event) => {
        setName(event.target.value)
    }

    const handleHost = () => {
        socket.emit("message", "alex")
    }

    useEffect(() => {
        socket.on("abc", ( data ) => {
            setName(data)
        })

        return () => socket.disconnect();
    }, [])

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