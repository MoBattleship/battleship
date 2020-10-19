import React, {useState, useEffect} from 'react'

function Board2Players() {
  const [ships, setShips] = useState({
    carrier: [],
    battleship: [],
    cruiser: [],
    submarine: [],
    destroyer: []
  })

  // DUMMY BOARDS
  const [boards, setBoards] = useState([])
  const alphabeth = "_ABCDEFGHIJKLMNO"
  const numbers = ["",1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
  useEffect(() => {
    function generateBoard() {
      let boards = []
      for(let i = 0; i < 16; i++){
        let temp = []
        for(let j = 0; j < 16; j++){
          temp.push(0)
        }
        boards.push(temp)
      }
      setBoards(boards)
    }
    generateBoard()
  }, [])

  const onDragOver = (e, row, coll) => {
    e.preventDefault()
  }

  const onDrop = (e, row, coll) => {
    const size = e.dataTransfer.getData("size")
    const name = e.dataTransfer.getData("name")
    const id = e.dataTransfer.getData("divId")
    const position = e.dataTransfer.getData("position")
    const shipsCoordinate = []

    for(let i = 0; i < size; i++){
      if (position === 'horizontal') {
        shipsCoordinate.push([row, ((++coll) - id)])
      } else {
        shipsCoordinate.push([((++row) - id), coll])
      }
    }
    const isOverBoard = shipsCoordinate[shipsCoordinate.length-1][1]
    isOverBoard <= 15 && setShips({...ships, [name]: shipsCoordinate})
  }

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
                          && <div onDrop={e => onDrop(e, rowIdx, collIdx)} onDragOver={(e) => onDragOver(e, rowIdx, collIdx)} key={collIdx} className="border border-white" style={{backgroundColor: "#1B9CC6", width: "40px", height: "40px"}}></div>
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

export default Board2Players
