import React, { useState, useLayoutEffect, useEffect } from "react";
import {useHistory} from 'react-router-dom'
import socket from "../../../helpers/socket";
import PlayerBoard from "./components/PlayerBoard";
import EnemyBoard from "./components/EnemyBoard";
import { Chat, addResponseMessage } from 'react-chat-popup'
function Start(props) {
  const history = useHistory()
  // let [count, setCount] = useState(0)
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

  let count = 0
  const handleAttackEnemy = (coor) => {
    setAttackEnemy([...attackEnemy, coor]);
  };

  const handleNewUserMessage = (newMessage) => {
    socket.emit("chatMessage", { socketId: socket.id, message: newMessage })
  }

  useEffect(() => {
    socket.on("chatMessage", (data) => {
      addResponseMessage(`${data.socketId} \r\n
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
      console.log(attackEnemy.length === totalEnemy, `ini dalam useeffect`)
      console.log(attackEnemy, `ini attack enemy`)
      socket.emit("resolveAttacks", attackEnemy);
    }
    attackEnemy.length === (totalEnemy-count) && sendAttackEnemyCoor();
  }, [attackEnemy]);
  
  useEffect(() => {
    socket.on("resolved", (data) => {
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
      count = newLoseData
      players[0].isLose && history.push("/endgame", {status: "loser", playerData: players[0]}) 
      newData.length === 1 && history.push("/endgame", {status: "winner", playerData: players[0]}) 
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
              attackFlag={attackFlag}
              handleAttackEnemy={handleAttackEnemy}
              styleBtn={styleBtn}
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
