import React, {useState, useEffect} from 'react'
import socket from '../../../../helpers/socket'

function PlayerBoard({data, isBoardFilled: fillBoard}) {
  console.log(data, `ini data player boards`)
  let allShipsCoordinate = []
  data.coordinates.ships.forEach(ship => {
    ship.isAlive && ship.coordinates.forEach(el => {
      allShipsCoordinate.push([el, true])
    })
    !ship.isAlive && ship.coordinates.forEach(el => {
      allShipsCoordinate.push([el, false])
    })
  })
  
  // const atlantisCoordinate = data.coordinates.atlantis
  // const plusBombCoordinate = data.coordinates.bombCount
  // const plusPowerCoordinate = data.coordinates.bombPower
  // const attackedCoordinate = data.attacked

  const [atlantisCoordinate, _atlantisCoordinate] = useState(data.coordinates.atlantis)
  const [plusBombCoordinate, _plusBombCoordinate] = useState(data.coordinates.bombCount)
  const [plusPowerCoordinate, _plusPowerCoordinate] = useState(data.coordinates.bombPower)
  const attacked = data.coordinates?.attacked

  // DUMMY BOARDS
  const [boards, setBoards] = useState([])
  const [isBoardFilled, setIsBoardFilled] = useState(fillBoard)
  // let isBoardFilled = fillBoard
  const alphabeth = "_ABCDEFGHIJKLMNO"
  const numbers = ["",1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]

  // Place Buff
  useEffect(() => {
    function generateBoard() {
      let boards = []
      for(let i = 0; i < 16; i++){
        let temp = []
        for(let j = 0; j < 16; j++){
          // Place atlantis
          if(i === atlantisCoordinate[0] && j === atlantisCoordinate[1]) temp.push(['atlantis'])
          
          // Place Plus Bomb
          else if(i === plusBombCoordinate[0][0] && j === plusBombCoordinate[0][1]) temp.push(['bomb'])
          else if(i === plusBombCoordinate[1][0] && j === plusBombCoordinate[1][1]) temp.push(['bomb'])
          
          // Place Plus Power
          else if(i === plusPowerCoordinate[0] && j === plusPowerCoordinate[1]) temp.push(['power'])

          else temp.push(['none'])
        }
        boards.push(temp)
      }
      // isBoardFilled = true
      setIsBoardFilled(true)
      setBoards(boards)
    }
    generateBoard()
  }, [])

  // Place Attacked
  useEffect(() => {
    function placeAttack() {
      let newBoard = JSON.parse(JSON.stringify(boards))
      attacked.forEach(coor => {
        const { coordinate: atkCoor} = coor
        newBoard[atkCoor[0]][atkCoor[1]] = ['hit']
        newBoard[atkCoor[0]][atkCoor[1]] = ['hit']
      })
      setBoards(newBoard)
    }
    attacked.length > 0 && placeAttack()
  }, [])

  // Place Kapal
  useEffect(() => {
    function placeShips(){
      let newBoard = JSON.parse(JSON.stringify(boards))
      allShipsCoordinate.forEach((coor, i) => {
        console.log(coor, `ini coor tapi di playerboard`)
        newBoard[coor[0][0]][coor[0][1]] = ['ship', coor[1]]
      })
      console.log(newBoard, `ini new board`)
      setBoards(newBoard)
    }
    // console.log(boards.length, `ini boards length`)
    // console.log(isBoardFilled, `ini isboardfilled`)
    boards.length > 1 && placeShips()
  }, [isBoardFilled])
  console.log(isBoardFilled)
  return (
    <div>
      <div className="container">
        {
          boards.map((row, rowIdx) => {
            return <div key={rowIdx} className="d-flex flex-wrap" style={{width: "640px"}}>
                {
                  row.map((coll, collIdx) => {
                    return (
                      <div key={collIdx}>
                        {
                          rowIdx === 0 && collIdx !== 0 && <div key={collIdx} className="border border-white bg-dark text-white column align-items-center justify-content-center align-items-center" style={{backgroundColor: "#fff", width: "40px", height: "40px"}}>{alphabeth[collIdx]}</div>
                        }
                        {
                          collIdx === 0 && <div key={collIdx} className="border border-white bg-dark text-white" style={{backgroundColor: "#fff", width: "40px", height: "40px"}}>{numbers[rowIdx]}</div>
                        }
                        {
                          rowIdx !== 0 
                          && collIdx !== 0 
                        && coll[0] === 'atlantis' && <div key={collIdx} className="border border-white text-white" style={{backgroundColor: "blue", width: "40px", height: "40px"}}>🔱</div>
                        }
                        {
                          rowIdx !== 0 
                          && collIdx !== 0 
                          && coll[0] === 'bomb' && <div key={collIdx} className="border border-white text-white" style={{backgroundColor: "black", width: "40px", height: "40px"}}>💣</div>
                        }
                        {
                          rowIdx !== 0 
                          && collIdx !== 0 
                          && coll[0] === 'power' && <div key={collIdx} className="border border-white text-white" style={{backgroundColor: "red", width: "40px", height: "40px"}}>💥</div>
                        }
                        {
                          rowIdx !== 0 
                          && collIdx !== 0 
                          && coll[0] === 'ship' && coll[1] && <div key={collIdx} className="border border-white" style={{backgroundColor: "yellow", width: "40px", height: "40px"}}>S</div>
                        }
                        {
                          rowIdx !== 0 
                          && collIdx !== 0 
                          && coll[0] === 'ship' && !coll[1] && <div key={collIdx} className="border border-white" style={{color: "red", backgroundColor: "red", width: "40px", height: "40px"}}>X</div>
                        }
                        {
                          rowIdx !== 0 
                          && collIdx !== 0 
                          && coll[0] === 'none' && <div key={collIdx} className="border border-white" style={{backgroundColor: "#1B9CC6", width: "40px", height: "40px"}}></div>
                        }
                        {
                          rowIdx !== 0 
                          && collIdx !== 0 
                          && coll[0] === 'hit' && <div key={collIdx} className="border border-white" style={{backgroundColor: "red", width: "40px", height: "40px"}}></div>
                        }
                      </div>
                    )
                  })
                }
            </div>
          })
        }
      </div>
    </div>
  )
}

export default PlayerBoard
