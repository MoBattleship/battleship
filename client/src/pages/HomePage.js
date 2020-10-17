import React, { useState, useEffect } from 'react'
import socket from '../helpers/socket'
import { useHistory } from 'react-router-dom'
import { Button } from 'react-bootstrap'

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition()

mic.continuous = true
mic.interimResults = true
mic.lang = 'id-ID'


function HomePage () {
    const [name, setName] = useState("")
    const [roomCode, setRoomCode] = useState("")
    const [isListening, setIsListening] = useState(false)
    const history = useHistory()

    
    const handleInputName = (event) => {
        setName(event.target.value)
    }

    const handleHost = () => {
        console.log(name, 'ini name yg dikirim ke server')
        socket.emit("host", {name})
        
    }

    useEffect(() => {
        handleListen()
    }, [isListening])

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
            mic.stop()
            // console.log(isListening, 'ini isListening sebelum pindah page')
            history.push('/lobby', {roomCode})
        }
    }, [roomCode])

    function handleListen() {
        if (isListening) {
            mic.start()
            mic.onend = () => {
                console.log('continue..')
                mic.start()
              }
        } else {
            mic.stop()
            mic.onend = () => {
                console.log('Stopped Mic on Click')
              }
        }
        mic.onstart = () => {
            console.log('Mics on')
          }

          mic.onresult = event => {
            const transcript = Array.from(event.results)
              .map(result => result[0])
              .map(result => result.transcript)
              .join('')
            console.log(transcript)
            setName(transcript)
            mic.onerror = event => {
              console.log(event.error)
            }
          }
    }

    function handleOnListening() {
        setIsListening(prevState => !prevState)
    }

    return (
        <div>
            <div className="splash-container">
                <img src="./images/sunset.svg" alt="logo" />
                <div className="splash-form">
                    <div className='row justify-content-center'>
                        <h2>Input Your Name</h2>
                    </div>
                        <div className='row justify-content-center'>
                            <input type="text" className="input-form" onChange={handleInputName} value={name} />
                            <img
                            className="ml-2 border rounded-lg"
                            role="button"
                            onClick={handleOnListening}
                            style={{height: '25px', width: '25px', padding:2}} 
                            src="https://cdn.iconscout.com/icon/free/png-512/mic-257-474988.png"
                            ></img>
                            {isListening && <p>Listening</p>}
                        </div>
                    </div>
                <div>
                    <div className = "row justify-content-center mt-3">
                        <button className="button splash-btn" onClick={handleHost}>HOST</button>
                        <button className="button splash-btn">JOIN</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage