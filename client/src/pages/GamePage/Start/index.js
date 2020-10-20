import React, {useState, useEffect} from 'react'
import socket from '../../../helpers/socket'
import PlayerBoard from './components/PlayerBoard'
import EnemyBoard from './components/EnemyBoard'

function Start(props) {
  const allData = props.location.state.data
  const playerData = allData.filter(board => board.socketId === socket.id)
  const enemyData  = allData.filter(board => board.socketId != socket.id) 
  const totalEnemy = allData.length - 1
  const [attackEnemy, setAttackEnemy] = useState([])

  const handleAttackEnemy = (coor) => {
    setAttackEnemy([...attackEnemy, coor])
  }

  useEffect(() => {
    function sendAttackEnemyCoor() {
      socket.emit('resolveAttacks', attackEnemy)
    } 
    attackEnemy.length === totalEnemy && sendAttackEnemyCoor()
  }, [attackEnemy])
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
