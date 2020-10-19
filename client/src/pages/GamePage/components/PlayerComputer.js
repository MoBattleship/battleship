import React, { useState, useEffect } from "react";

function PlayerComputer({ changeDisplay }) {
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
                    className="border border-white"
                    style={{
                      backgroundColor: "#4b5320 ",
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
                    className="border border-white"
                    style={{
                      backgroundColor: "#4b5320 ",
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
                    className="border border-white"
                    style={{
                      backgroundColor: "#4b5320 ",
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
                    className="border border-white"
                    style={{
                      backgroundColor: "#4b5320 ",
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
                    className="border border-white"
                    style={{
                      backgroundColor: "#4b5320 ",
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
