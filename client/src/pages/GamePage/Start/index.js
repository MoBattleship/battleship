import React, { useState, useLayoutEffect, useEffect } from "react";
import {useHistory} from 'react-router-dom'
import socket from "../../../helpers/socket";
import PlayerBoard from "./components/PlayerBoard";
import EnemyBoard from "./components/EnemyBoard";
import { Chat, addResponseMessage } from 'react-chat-popup'

function Start(props) {
  const history = useHistory()
  const [allData, setAllData] = useState(props.location.state.data);
  let playersTemp = allData.filter((board) => board.socketId === socket.id);
  let enemyTemp = allData.filter((board) => board.socketId != socket.id);
  const [playerData, setPlayerData] = useState(playersTemp);
  const [enemyData, setEnemyData] = useState(enemyTemp);
  const totalEnemy = allData.length - 1;
  const [attackEnemy, setAttackEnemy] = useState([]);
  const [attackFlag, setAttackFlag] = useState(false);
  const [isBoardFilled, setIsBoardFilled] = useState(false);
  const [styleBtn, setStyleBtn] = useState('btn');
  console.log(playerData, `ini player data`)
  let [count, setCount] = useState(0)
  
  const handleAttackEnemy = (coor) => {
    setAttackEnemy([...attackEnemy, coor]);
  };
  
  const handleNewUserMessage = (newMessage) => {
    console.log(playerData[0].name, "<<< ini namenya")
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
    function sendAttackEnemyCoor() {
      socket.emit("resolveAttacks", attackEnemy);
    }
    // (attackEnemy.length + (playerData[0]?.activePowers?.bombCount - 1)) === (totalEnemy-count) && sendAttackEnemyCoor();
    attackEnemy.length === (totalEnemy-count) && sendAttackEnemyCoor();
  }, [attackEnemy, count]);
  
  useEffect(() => {
    socket.on("resolved", (data) => {
      console.log(data, `ini resolve`)
      let newData = data.filter(player => !player.isLose)
      let newLoseData = data.filter(player => player.isLose)
      let players = data.filter((board) => board.socketId === socket.id);
      let enemy = data.filter((board) => board.socketId != socket.id);
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
              countAttack={playerData[0]?.activePowers?.bombCount}
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
