import React, { useState, useLayoutEffect, useEffect } from "react";
import {useHistory} from 'react-router-dom'
import socket from "../../../helpers/socket";
import PlayerBoard from "./components/PlayerBoard";
import EnemyBoard from "./components/EnemyBoard";
import { Chat, addResponseMessage } from 'react-chat-popup'
let count = 0
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
    attackEnemy.length === totalEnemy && sendAttackEnemyCoor();
  }, [attackEnemy]);
  
  useEffect(() => {
    socket.on("resolved", (data) => {
      console.log(data, `ini hasil resolved`)
      let players = data.filter((board) => board.socketId === socket.id);
      let enemy = data.filter((board) => board.socketId != socket.id);
      setAttackEnemy([])
      setAllData(data);
      setPlayerData(players);
      setEnemyData(enemy);
      setAttackFlag(false);
      setStyleBtn('btn')
      setIsBoardFilled(false)
    });

    socket.on("winner", (data) => {
      console.log(data, `ini data winner`)
      history.push("/endgame", {winner: data[0]})
    })
  }, []);
  return (
    <div>
      <div>
        <PlayerBoard isBoardFilled={isBoardFilled} data={playerData[0]} />
      </div>
      <div>
        {enemyData.map((enemy, idx) => {
          count++
          console.log(count)
          return (
            <EnemyBoard
            key={enemy.socketId}
              attackFlag={attackFlag}
              handleAttackEnemy={handleAttackEnemy}
              styleBtn={styleBtn}
              data={enemy}
            />
          );
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
