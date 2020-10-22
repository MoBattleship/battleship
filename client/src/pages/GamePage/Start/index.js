import React, { useState, useLayoutEffect, useEffect } from "react";
import {useHistory} from 'react-router-dom'
import socket from "../../../helpers/socket";
import PlayerBoard from "./components/PlayerBoard";
import EnemyBoard from "./components/EnemyBoard";
import { Chat, addResponseMessage, dropMessages } from 'react-chat-popup'
import Swal from 'sweetalert2'

function Start(props) {
  const history = useHistory()
  const [allData, setAllData] = useState(props.location.state.data);
  let playersTemp = allData.filter((board) => board.socketId === socket.id);
  let enemyTemp = allData.filter((board) => board.socketId != socket.id);
  const [playerData, setPlayerData] = useState(playersTemp);
  const [bombCount, setBombCount] = useState(playerData[0]?.activePowers?.bombCount);
  const [enemyData, setEnemyData] = useState(enemyTemp);
  const totalEnemy = allData.length - 1;
  const [attackEnemy, setAttackEnemy] = useState([]);
  const [attackFlag, setAttackFlag] = useState(false);
  const [isBoardFilled, setIsBoardFilled] = useState(false);
  const [styleBtn, setStyleBtn] = useState('btn');
  let [count, setCount] = useState(0)
  
  const handleAttackEnemy = (coor) => {
    setAttackEnemy([...attackEnemy, coor]);
  };
  const handleSetBombCount = (bomb) => {
    setBombCount(bomb);
  };
  
  const handleNewUserMessage = (newMessage) => {
    socket.emit("chatMessage", { sender: playerData[0].name, message: newMessage })
  }

  useEffect(() => {
    socket.on("chatMessage", (data) => {
      addResponseMessage(`${data.sender} \r\n
      ${data.message}`)
    })
  }, [])

  useEffect(() => {
    socket.on("announcement", (data) => {
      addResponseMessage(data)
    })
  }, [])

  useEffect(() => {
    socket.on("bombCount", (data) => {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      
      Toast.fire({
        icon: 'success',
        title: `${data}`
      })
    })
  }, [])

  useEffect(() => {
    socket.on("power", (data) => {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      
      Toast.fire({
        icon: 'success',
        title: `${data}`
      })
    })
  }, [])

  useEffect(() => {
    socket.on("atlantisHit", () => {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      
      Toast.fire({
        icon: 'error',
        title: `Oh No! Atlantis was hit.. 😥`
      })
    })
  }, [])

  useEffect(() => {
    function sendAttackEnemyCoor() {
      socket.emit("resolveAttacks", attackEnemy);
    }
    playerData[0]?.activePowers?.bombCount < 2 ?
    (attackEnemy.length + (playerData[0]?.activePowers?.bombCount - 1)) === ((totalEnemy-count) + playerData[0]?.activePowers?.bombCount - 1) && sendAttackEnemyCoor():
    (attackEnemy.length + (playerData[0]?.activePowers?.bombCount - 1)) === ((totalEnemy-count) + playerData[0]?.activePowers?.bombCount) && sendAttackEnemyCoor()
  }, [attackEnemy, count]);

  
  useEffect(() => {
    socket.on("resolved", (data) => {
      let newData = data.filter(player => !player.isLose)
      let newLoseData = data.filter(player => player.isLose)
      let players = data.filter((board) => board.socketId === socket.id);
      let enemy = data.filter((board) => board.socketId != socket.id);
      setBombCount(players[0]?.activePowers?.bombCount)
      setAttackEnemy([])
      setAllData(data);
      setPlayerData(players);
      setEnemyData(enemy);
      setAttackFlag(false);
      setStyleBtn('btn')
      setIsBoardFilled(false)
      newLoseData.length > 0 && setCount(newLoseData.length)
      players[0].isLose && history.push("/endgame", {status: "loser", playerData: players[0]}) 
      newData.length === 1 && !players[0].isLose && history.push("/endgame", {status: "winner", playerData: players[0]})
      dropMessages() 
    });

    }, []);
  return (
    <div>
      <div>
        <PlayerBoard isBoardFilled={isBoardFilled} data={playerData[0]} />
      </div>
      <div>
        {enemyData.map((enemy, idx) => {
              return !enemy.isLose &&
              <EnemyBoard
              key={enemy.socketId}
              handleSetBombCount={handleSetBombCount}
              countAttack={bombCount}
              attackFlag={attackFlag}
              handleAttackEnemy={handleAttackEnemy}
              setBtn={styleBtn}
              data={enemy}
            />
        })}
      </div>
      <div>
        <Chat 
          senderPlaceHolder="Type your message here..."
          title="Chatbox"
          handleNewUserMessage={handleNewUserMessage}
        />
      </div>
    </div>
  );
}

export default Start;
