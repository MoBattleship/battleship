import React, { useState, useEffect } from "react";
import carrier1 from '../../../../assets/carrier/carrier1.png'
import carrier2 from '../../../../assets/carrier/carrier2.png'
import carrier3 from '../../../../assets/carrier/carrier3.png'
import carrier4 from '../../../../assets/carrier/carrier4.png'
import carrier5 from '../../../../assets/carrier/carrier5.png'

import carriervertical1 from '../../../../assets/carrier/carrier1vertical.png'
import carriervertical2 from '../../../../assets/carrier/carrier2vertical.png'
import carriervertical3 from '../../../../assets/carrier/carrier3vertical.png'
import carriervertical4 from '../../../../assets/carrier/carrier4vertical.png'
import carriervertical5 from '../../../../assets/carrier/carrier5vertical.png'

import battleship1 from '../../../../assets/battleship/battleship1.png'
import battleship2 from '../../../../assets/battleship/battleship2.png'
import battleship3 from '../../../../assets/battleship/battleship3.png'
import battleship4 from '../../../../assets/battleship/battleship4.png'

import battleshipvertical1 from '../../../../assets/battleship/battleshipvertical1.png'
import battleshipvertical2 from '../../../../assets/battleship/battleshipvertical2.png'
import battleshipvertical3 from '../../../../assets/battleship/battleshipvertical3.png'
import battleshipvertical4 from '../../../../assets/battleship/battleshipvertical4.png'

import cruiser1 from '../../../../assets/cruiser/cruiser1.png'
import cruiser2 from '../../../../assets/cruiser/cruiser2.png'
import cruiser3 from '../../../../assets/cruiser/cruiser3.png'

import cruiservertical1 from '../../../../assets/cruiser/cruiser1vertical.png'
import cruiservertical2 from '../../../../assets/cruiser/cruiser2vertical.png'
import cruiservertical3 from '../../../../assets/cruiser/cruiser3vertical.png'

import submarine1 from '../../../../assets/submarine/submarine1.png'
import submarine2 from '../../../../assets/submarine/submarine2.png'
import submarine3 from '../../../../assets/submarine/submarine3.png'

// import submarinevertical1 from '../../../../assets/submarine/submarinevertical1.png'
// import submarinevertical2 from '../../../../assets/submarine/submarinevertical2.png'
// import submarinevertical3 from '../../../../assets/submarine/submarinevertical3.png'

import destroyer1 from '../../../../assets/destroyer/destroyer1.png'
import destroyer2 from '../../../../assets/destroyer/destroyer2.png'

// import destroyervertical1 from '../../../../assets/destroyer/destroyervertical1.png'
// import destroyervertical2 from '../../../../assets/destroyer/destroyervertical2.png'

function PlayerComputer({ changeDisplay }) {
  const carriers = {row: [carrier1, carrier2, carrier3, carrier4, carrier5], column: [carriervertical5, carriervertical4, carriervertical3, carriervertical2, carriervertical1]}
  const battleships = {row: [battleship1, battleship2, battleship3, battleship4], column: [battleshipvertical4, battleshipvertical3, battleshipvertical2, battleshipvertical1]}
  const submarines = [submarine1, submarine2, submarine3]
  const cruisers = {row: [cruiser1, cruiser2, cruiser3], column: [cruiservertical3, cruiservertical2, cruiservertical1]}
  const destroyers = [destroyer1, destroyer2]

  // const carriersvertical = [carriervertical1, carriervertical2, carriervertical3, carriervertical4, carriervertical5]
  // const battleshipsvertical = [battleshipvertical1, battleshipvertical2, battleshipvertical3, battleshipvertical4]
  // const submarinesvertical = [submarinevertical1, submarinevertical2, submarinevertical3]
  // const cruisersvertical = [cruiservertical1, cruiservertical2, cruiservertical3]
  // const destroyersvertical = [destroyervertical1, destroyervertical2]
  
  const [divId, setDivId] = useState(0);
  const [position, setPosition] = useState("row");
  const [display, setDisplay] = useState("");
  const [displayName, setDisplayName] = useState("horizontal");
  const [isPlace, setIsPlace] = useState({
    carrier: [],
    battleship: [],
    cruiser: [],
    submarine: [],
    destroyer: [],
  });
  
  useEffect(() => {
    setIsPlace({ ...isPlace, [changeDisplay?.name]: changeDisplay?.display });
  }, [changeDisplay]);

  const onDragStart = (e, size, name) => {
    e.dataTransfer.setData("size", size);
    e.dataTransfer.setData("name", name);
    e.dataTransfer.setData("divId", divId);
    e.dataTransfer.setData("position", displayName);
  };

  const handlePositionX = () => {
    setPosition("row");
    setDisplay("");
    setDisplayName("horizontal");
  };
  
  const handlePositionY = () => {
    setPosition("column");
    setDisplay("row justify-content-left");
    setDisplayName("vertical");
  };
  
  const onMouseEnter = (e, id) => {
    setDivId(id);
  };
  
  return (
    <div>
     <div className="container justify-content-center">
        <img src="./images/mo-battleship.png" style={{ height: "10rem" }} />
      </div>  
      <button className="btn btn-info m-1" onClick={handlePositionY}>
        Vertical
      </button>
      <button className="btn btn-info m-1" onClick={handlePositionX}>
        Horizontal
      </button>
      <div className={`container ${display}`}>
        {/* Carrier */}
        <div
          className={`${position} m-1 p-1`}
          style={{ display: isPlace.carrier || position }}
        >
          <div
            className={`${position}`}
            draggable
            onDragStart={(e) => onDragStart(e, 5, "carrier")}
          >
            {Array.from({ length: 5 })
              .fill("")
              .map((carrier, idx) => {
                return (
                  <div
                    key={idx}
                    onMouseEnter={(e) => onMouseEnter(e, idx+1)}
                    // className="border border-white"
                    style={{
                      backgroundImage: `url(${carriers[position][idx]})`,
                      backgroundSize: 'contain',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      width: "40px",
                      height: "40px",
                    }}
                  ></div>
                );
              })}
          </div>
        </div>

        {/* BattleShip */}
        <div
          className={`${position} m-1 p-1`}
          style={{ display: isPlace.battleship || position }}
        >
          <div
            className={`${position}`}
            draggable
            onDragStart={(e) => onDragStart(e, 4, "battleship")}
          >
            {Array.from({ length: 4 })
              .fill("")
              .map((_, idx) => {
                return (
                  <div
                    key={idx}
                    onMouseEnter={(e) => onMouseEnter(e, idx+1)}
                    // className="border border-white"
                    style={{
                      backgroundImage: `url(${battleships[position][idx]})`,
                      backgroundSize: 'contain',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      width: "40px",
                      height: "40px",
                    }}
                  ></div>
                );
              })}
          </div>
        </div>

        {/* Cruiser */}
        <div
          className={`${position} m-1 p-1`}
          style={{ display: isPlace.cruiser || position }}
        >
          <div
            className={`${position}`}
            draggable
            onDragStart={(e) => onDragStart(e, 3, "cruiser")}
          >
            {Array.from({ length: 3 })
              .fill("")
              .map((_, idx) => {
                return (
                  <div
                    key={idx}
                    onMouseEnter={(e) => onMouseEnter(e, idx+1)}
                    // className="border border-white"
                    style={{
                      backgroundImage: `url(${cruisers[position][idx]})`,
                      backgroundSize: 'contain',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      width: "40px",
                      height: "40px",
                    }}
                  ></div>
                );
              })}
          </div>
        </div>

        {/* Submarine */}
        <div
          className={`${position} m-1 p-1`}
          style={{ display: isPlace.submarine || position }}
        >
          <div
            className={`${position}`}
            draggable
            onDragStart={(e) => onDragStart(e, 3, "submarine")}
          >
            {Array.from({ length: 3 })
              .fill("")
              .map((_, idx) => {
                return (
                  <div
                    key={idx}
                    onMouseEnter={(e) => onMouseEnter(e, idx+1)}
                    // className="border border-white"
                    style={{
                      backgroundImage: `url(${submarines[idx]})`,
                      backgroundSize: 'contain',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      width: "40px",
                      height: "40px",
                    }}
                  ></div>
                );
              })}
          </div>
        </div>

        {/* Destroyer */}
        <div
          className={`${position} m-1 p-1`}
          style={{ display: isPlace.destroyer || position }}
        >
          <div
            className={`${position}`}
            draggable
            onDragStart={(e) => onDragStart(e, 2, "destroyer")}
          >
            {Array.from({ length: 2 })
              .fill("")
              .map((_, idx) => {
                return (
                  <div
                    key={idx}
                    onMouseEnter={(e) => onMouseEnter(e, idx+1)}
                    // className="border border-white"
                    style={{
                      backgroundImage: `url(${destroyers[idx]})`,
                      backgroundSize: 'contain',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      width: "40px",
                      height: "40px",
                    }}
                  ></div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerComputer;
