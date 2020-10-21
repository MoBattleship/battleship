import React, { useState, useEffect } from "react";
import socket from '../../../../helpers/socket'
import {useHistory} from 'react-router-dom'

function Preparation({handleDisplay}) {
  const history = useHistory()
  const [ships, setShips] = useState({
    carrier: [],
    battleship: [],
    cruiser: [],
    submarine: [],
    destroyer: [],
  });
  
  const [allCoor, setAllCoor] = useState([]);
  const [drop, setDrop] = useState(false);
  
  // DUMMY BOARDS
  const [boards, setBoards] = useState([]);
  const alphabeth = "_ABCDEFGHIJKLMNO";
  const numbers = ["", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  
  useEffect(() => {
    function generateBoard() {
      let boards = [];
      for (let i = 0; i < 16; i++) {
        let temp = [];
        for (let j = 0; j < 16; j++) {
          temp.push(false);
        }
        boards.push(temp);
      }
      setBoards(boards);
    }
    generateBoard();
  }, []);
  
  // HANDLE SHIPS PLACEMANET
  useEffect(() => {
    function generateShip() {
      let newBoards = boards;
      let shipsCoor = allCoor;
      
      shipsCoor.forEach((ship) => {
        newBoards[ship[0]][ship[1]] = true;
      });
      setBoards(newBoards);
    }
    allCoor.length > 0 && generateShip();
    setDrop(false)
  }, [drop]);

  useEffect(() => {
    function ready() {
      let temp = []
      for (const ship in ships) {
        temp.push({
          name: ship,
          length: ships[ship].length,
          coordinates: ships[ship]
        })
      }
      socket.emit("ready", { temp })
    }

    
    allCoor.length === 17 && ready()
  }, [allCoor])

  // useEffect(() => {
  //   socket.on('announcements', (announcement) => {
  //   console.log(announcement)
  //   })
  // }, [])
  
  const onDragOver = (e, row, coll) => {
    e.preventDefault();
    
  };
  
  const onDrop = (e, row, coll) => {
    const size = e.dataTransfer.getData("size");
    const name = e.dataTransfer.getData("name");
    const id = e.dataTransfer.getData("divId");
    const position = e.dataTransfer.getData("position");
    const shipsCoordinate = [];
    
    for (let i = 0; i < size; i++) {
      if (position === "horizontal") {
        shipsCoordinate.push([row, ++coll - id]);
      } else {
        shipsCoordinate.push([++row - id, coll]);
      }
    }
    let isOverBoard
    if(position === 'horizontal'){
      if (shipsCoordinate[0][1] < 1 ) {
        return
      } 
      isOverBoard = shipsCoordinate[shipsCoordinate.length - 1][1];
    } else {
      if (shipsCoordinate[0][0] < 1) {
        return
      }
      isOverBoard = shipsCoordinate[shipsCoordinate.length - 1][0];
    }
    let isOverlapping = false
    for (const ship of shipsCoordinate) {
      for (const coor of allCoor) {
        `${ship}` === `${coor}` && (isOverlapping = true)
        if (isOverlapping) return
      }
    }
    
    if (isOverBoard <= 15) {
      setAllCoor(allCoor.concat(shipsCoordinate))
      setShips({ ...ships, [name]: shipsCoordinate})
      handleDisplay({name, display: "none"})
    }
    setDrop(true)
  };
  
  useEffect(() => {
    socket.on("allBoards", (data) => {
      history.push("/start", {data})
    })
  }, [])
  return (
    <div>
      <div className="container">
        {boards.map((row, rowIdx) => {
          return (
            <div
              key={rowIdx}
              className="d-flex flex-wrap"
              style={{ width: "640px" }}
            >
              {row.map((coll, collIdx) => {
                return (
                  <div key={collIdx}>
                    {rowIdx === 0 && collIdx !== 0 && (
                      <div
                        key={collIdx}
                        className="border border-white bg-dark text-white column align-items-center justify-content-center align-items-center"
                        style={{
                          backgroundColor: "#fff",
                          width: "40px",
                          height: "40px",
                        }}
                      >
                        {alphabeth[collIdx]}
                      </div>
                    )}
                    {collIdx === 0 && (
                      <div
                        key={collIdx}
                        className="border border-white bg-dark text-white"
                        style={{
                          backgroundColor: "#fff",
                          width: "40px",
                          height: "40px",
                        }}
                      >
                        {numbers[rowIdx]}
                      </div>
                    )}
                    {rowIdx !== 0 && collIdx !== 0 && !coll && (
                      <div
                        onDrop={(e) => onDrop(e, rowIdx, collIdx)}
                        onDragOver={(e) => onDragOver(e, rowIdx, collIdx)}
                        key={collIdx}
                        className="border border-white"
                        style={{
                          backgroundColor: "#1B9CC6",
                          width: "40px",
                          height: "40px",
                        }}
                      ></div>
                    )}
                    {rowIdx !== 0 && collIdx !== 0 && coll && (
                      <div
                        onDrop={(e) => onDrop(e, rowIdx, collIdx)}
                        onDragOver={(e) => onDragOver(e, rowIdx, collIdx)}
                        key={collIdx}
                        className="border border-white"
                        style={{
                          backgroundColor: "#4b5320",
                          width: "40px",
                          height: "40px",
                        }}
                      ></div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Preparation;
