import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import socket from "../../../helpers/socket";

function PlayerCard({ player, playerColours }) {
  const [allPlayers, setAllPlayers] =useState([])
  const colours = [
    "#f9ca24",
    "#e84118",
    "#3742fa",
    "#4834d4",
    "#f5f6fa",
    "#fff200",
    "#f8a5c2",
  ];
  
  function playerColourGenerator(selectedColour) {
    socket.emit("changeColor", {selectedColour, socketId: player.socketId})
  }

  useEffect(() => {
    const p = allPlayers.filter(currentPlayer => currentPlayer.socketId === player.socketId)[0]
  }, [allPlayers])
  
  return (
    <div>
      <div className="col ml-5 mr-5 mt-3 mb-3">
        <Card style={{ width: "18rem" }}>
          <h5 style={{ backgroundColor: player.color }}>{player.name}</h5>
          <div style={{ backgroundColor: "#ffffff" }} className="justify-content-center">
            <Card.Img
              style={styles.image}
              variant="top"
              src="https://i.pinimg.com/originals/0e/ba/2b/0eba2bf62d74ed3b0e7aafec0ce4d1cc.jpg"
            />
          </div>
          <Card.Body style={{ backgroundColor: "#ffffff" }}>
            <Card.Text hidden={socket.id !== player.socketId} style={{ backgroundColor: "transparent" }} >Select Color:</Card.Text>
            {socket.id === player.socketId && 
            <div>
              <div className="row justify-content-left">
              </div>
              <div className="row justify-content-left" style={{ backgroundColor: "#ffffff" }}>
                {colours.map((colour, index) => {
                  if(playerColours.map(pc => pc.color).includes(colour) || colour === player.color) {
                    return (
                      <Button
                        key={index}
                        className="mr-1"
                        style={{ background: colour, height: "5px", width: "5px" }}
                        value={colour}
                        disabled={true}
                        onClick={() => playerColourGenerator(colour)}
                    ></Button>
                    );
                  } else {
                    return (
                      <Button
                        key={index}
                        className="mr-1"
                        style={{ background: colour, height: "5px", width: "5px" }}
                        value={colour}
                        disabled={false}
                        onClick={() => playerColourGenerator(colour)}
                      ></Button>
                    )
                  }
                })}
              </div>
            </div>
            }
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

const styles = {
  image: {
    height: "17rem",
    width: "17rem",
    backgroundColor: "#ffffff"
  },
};

export default PlayerCard;
