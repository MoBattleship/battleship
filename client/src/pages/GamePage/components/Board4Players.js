import React from 'react'

function Board4Players() {
  let alphabeth = "_ABCDEFGHIJKLMNOPQRSTUVWXY"
  let numbers = ["",1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]
  let boards = []
  for(let i = 0; i < 26; i++){
    let temp = []
    for(let j = 0; j < 26; j++){
      temp.push(0)
    }
    boards.push(temp)
  }

  return (
    <div className="row justify-content-center">
      <div className="container row justify-content-center">
        {
          boards.map((row, rowIdx) => {
            return <div key={rowIdx} className="d-flex flex-wrap" style={{width: "1040px"}}>
                {
                  row.map((coll, collIdx) => {
                    return (
                      <div>
                        {
                          rowIdx === 0 && collIdx !== 0 && <div key={collIdx} className="border border-white bg-dark text-white column align-items-center justify-content-center align-items-center" style={{backgroundColor: "#fff", width: "40px", height: "40px"}}>{alphabeth[collIdx]}</div>
                        }
                        {
                          collIdx === 0 && <div key={collIdx} className="border border-white bg-dark text-white" style={{backgroundColor: "#fff", width: "40px", height: "40px"}}>{numbers[rowIdx]}</div>
                        }
                        {
                          rowIdx !== 0 && collIdx !== 0 && <div key={collIdx} className="border border-white" style={{backgroundColor: "#1B9CC6", width: "40px", height: "40px"}}></div>
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

export default Board4Players
