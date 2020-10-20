import React, {useState, useEffect} from 'react'
import socket from '../../../helpers/socket'
import PlayerBoard from './components/PlayerBoard'
import EnemyBoard from './components/EnemyBoard'

function Start(props) {
  const [allData, setAllData] = useState(props.location.state.data)
  let playersTemp = allData.filter(board => board.socketId === socket.id)
  let enemyTemp = allData.filter(board => board.socketId != socket.id)
  const [playerData, setPlayerData] = useState(playersTemp) 
  const [enemyData, setEnemyData]  = useState(enemyTemp) 
  const totalEnemy = allData.length - 1
  const [attackEnemy, setAttackEnemy] = useState([])

  const handleAttackEnemy = (coor) => {
    setAttackEnemy([...attackEnemy, coor])
  }

  useEffect(() => {
      socket.on("updateAttacks", (data) => {
        let players = data.filter(board => board.socketId === socket.id)
        let enemy = data.filter(board => board.socketId != socket.id)
        setAllData(data)
        setPlayerData(players)
        setEnemyData(enemy)
      })
  }, [])

  useEffect(() => {
    function sendAttackEnemyCoor() {
      socket.emit('resolveAttacks', attackEnemy)
    } 
    attackEnemy.length === totalEnemy && sendAttackEnemyCoor()
  }, [attackEnemy])

  useEffect(() => {
    socket.on("resolved", (res) => {
      console.log(res, `THIS IS AMERICA`)
    })
  }, [])
  return (
    <div>
      <div>
        <PlayerBoard data={playerData[0]} />
      </div>
      <div>
        {
          enemyData.map((enemy, idx) => {
            return <EnemyBoard key={idx} handleAttackEnemy={handleAttackEnemy} data={enemy} />
          })
        }
      </div>
    </div>
  )
}

export default Start
