import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import socket from "../../../helpers/socket";

function PlayerCard({ player, playerColours }) {
  const colours = [
    "#f9ca24",
    "#e84118",
    "#3742fa",
    "#4834d4",
    "#f5f6fa",
    "#fff200",
    "#f8a5c2",
  ];
  let newColour = []
  // playerColours = playerColours.forEach(color => {
  //   console.log(colours.includes(color.color), 'ini color.color')
  //   if(!colours.includes(color.color)) {
  //     newColour.push(colours[colours.indexOf(color.color)])
  //   }
  // })
  for (let i = 0; i < colours.length; i++) {
    for (let j = 0; j < playerColours.length; j++) {
      if (colours[i] !== playerColours[j]) {
        newColour.push(colours[i])
      }
    }
  }
  console.log(newColour, 'ini newColour')
  console.log(playerColours, 'ini playerColours')
  console.log(player, 'ini player di card')
  console.log(player.socketId, 'ini player.socketId')
  console.log(socket.id, 'ini socket.id')
  const [playerColour, setPlayerColour] = useState(player.color);

  function playerColourGenerator(selectedColour) {
    setPlayerColour(selectedColour);
    console.log(playerColour, "ini playercolour");
  }

  return (
    <div>
      <div className="col ml-5 mr-5 mt-3 mb-3">
        <Card style={{ width: "18rem" }}>
          <h5 style={{ backgroundColor: playerColour }}>Ready</h5>
          <div className="justify-content-center">
            <Card.Img
              style={styles.image}
              variant="top"
              src="https://i.pinimg.com/originals/0e/ba/2b/0eba2bf62d74ed3b0e7aafec0ce4d1cc.jpg"
            />
          </div>
          <Card.Body>
            <Card.Title>{player.name}</Card.Title>
            <Card.Text>Select Color:</Card.Text>
            {socket.id === player.socketId && 
            <div>
              <div className="row justify-content-left">
              </div>
              <div className="row justify-content-left">
                {colours.map((colour, index) => {
                  if(colour === playerColour) {
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
  },
};

export default PlayerCard;
