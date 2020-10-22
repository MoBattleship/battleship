import React, {useEffect, useState} from 'react'
import { Chat, addResponseMessage } from 'react-chat-popup'

import Preparation from './components/Preparation'
import PlayerComputer from './components/PlayerComputer'
import socket from '../../../helpers/socket'

function GamePage(props) {
  const [display, setDisplay] = useState('')
  const [chats, setChats] = useState([])

  const players = props?.location?.state?.playersData
  const code = props?.location?.state?.roomCode

  function handleNewUserMessage(newMessage) {
    let senderName = ''
    players.map(player => {
      if(player.socketId === socket.id) {
        senderName = player.name
      }
    })
    socket.emit("chatMessage", {sender: senderName, message: newMessage})
  }

  function handleNewMessage(newMessage) {
    socket.emit("chatMessage", {message: newMessage})
  }

  useEffect(() => {
    socket.on("chatMessage", (data) => {
      addResponseMessage(`${data.sender} \r\n
      ${data.message}`)
      let newChats = chats.concat(...chats, data.message)
      setChats(newChats)
    })
  }, [])

  useEffect(() => {
    socket.on("announcement", (data) => {
      addResponseMessage(data)
      let newChats = chats.concat(...chats, data)
      setChats(newChats)
    })
  }, [])

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
          <Preparation handleDisplay={handleSetDisplay}/>
      </div>
      <div>
        <Chat
        senderPlaceHolder="Type your message here..."
        badge={chats.length}
        title="Chatbox"
        profileAvatar="https://i.pinimg.com/originals/0e/ba/2b/0eba2bf62d74ed3b0e7aafec0ce4d1cc.jpg"
        handleNewUserMessage={handleNewUserMessage}
        ></Chat>
      </div>
    </div>
  )
}

const styles = {
  chatbox: {
    backgroundColor: '#474787'
  }
}

export default GamePage
