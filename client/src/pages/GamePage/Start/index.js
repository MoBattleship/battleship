import React, { useState, useLayoutEffect, useEffect } from "react";
import socket from "../../../helpers/socket";
import PlayerBoard from "./components/PlayerBoard";
import EnemyBoard from "./components/EnemyBoard";

function Start(props) {
  // let [count, setCount] = useState(0)
  let count = 0
  const [allData, setAllData] = useState(props.location.state.data);
  let playersTemp = allData.filter((board) => board.socketId === socket.id);
  let enemyTemp = allData.filter((board) => board.socketId != socket.id);
  const [playerData, setPlayerData] = useState(playersTemp);
  const [enemyData, setEnemyData] = useState(enemyTemp);
  const totalEnemy = allData.length - 1;
  const [attackEnemy, setAttackEnemy] = useState([]);
  const [attackFlag, setAttackFlag] = useState(false);

  const handleAttackEnemy = (coor) => {
    setAttackEnemy([...attackEnemy, coor]);
  };

  useEffect(() => {
    function sendAttackEnemyCoor() {
      socket.emit("resolveAttacks", attackEnemy);
    }
    attackEnemy.length === totalEnemy && sendAttackEnemyCoor();
  }, [attackEnemy]);

  useEffect(() => {
    socket.on("resolved", (data) => {
      console.log(data, `ini data resolved`);
      let players = data.filter((board) => board.socketId === socket.id);
      let enemy = data.filter((board) => board.socketId != socket.id);
      setAllData(data);
      setPlayerData(players);
      setEnemyData(enemy);
      setAttackFlag(true);
    });
  }, []);
  return (
    <div>
      <div>
        <PlayerBoard data={playerData[0]} />
      </div>
      <div>
        {enemyData.map((enemy, idx) => {
          count++
          return (
            <EnemyBoard
            // key={Number(new Date()) + count}
            key={idx}
            // key={}
              attackFlag={attackFlag}
              handleAttackEnemy={handleAttackEnemy}
              data={enemy}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Start;
