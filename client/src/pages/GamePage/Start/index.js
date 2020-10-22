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
    console.log(attackEnemy, `ini diluar emit`)
    console.log(count, `count`)
    console.log((attackEnemy.length + (playerData[0]?.activePowers?.bombCount - 1)) === (totalEnemy-count), `ini kondisi menjalankan emit`)
    console.log(attackEnemy.length + (playerData[0]?.activePowers?.bombCount - 1), `ini atk length + bombcount`)
    console.log(attackEnemy.length, `ini atk length`)
    console.log(playerData[0]?.activePowers?.bombCount - 1, `ini bomb count`)
    console.log(totalEnemy-count, `total eneymy - count`)
    console.log(totalEnemy, `total enemy`)
    function sendAttackEnemyCoor() {
      console.log(attackEnemy, `ini didalam emit`)
      socket.emit("resolveAttacks", attackEnemy);
    }
    playerData[0]?.activePowers?.bombCount < 2 ?
    (attackEnemy.length + (playerData[0]?.activePowers?.bombCount - 1)) === ((totalEnemy-count) + playerData[0]?.activePowers?.bombCount - 1) && sendAttackEnemyCoor():
    (attackEnemy.length + (playerData[0]?.activePowers?.bombCount - 1)) === ((totalEnemy-count) + playerData[0]?.activePowers?.bombCount) && sendAttackEnemyCoor()
  }, [attackEnemy, count]);
  
  useEffect(() => {
    socket.on("resolved", (data) => {
      console.log(data, `resolved`)
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
