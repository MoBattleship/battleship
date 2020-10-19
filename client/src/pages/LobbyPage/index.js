import React, { useState, useEffect } from "react";
import PlayerCard from "./components/PlayerCard";
import socket from "../../helpers/socket";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

function LobbyPage(props) {
  const history = useHistory();
  const [roomCode, setRoomCode] = useState("");
  const [playersData, setPlayersData] = useState([]);

  // HANDLE HOST DATA
  let hostStatus = props?.location?.state?.status;
  let hostName = props?.location?.state?.name;

  // HANDLE MEMBER DATA (JOIN)
  let memberCode = props?.location?.state?.code;
  let memberName = props?.location?.state?.name;

  useEffect(() => {
    function host() {
      socket.emit("host", { name: hostName });
    }
    hostStatus === "host" && host();
  }, []);

  useEffect(() => {
    function join() {
      socket.emit("join", { code: memberCode, name: memberName });
      socket.on("roomFull", ({ message }) => {
        history.push("/");
      });
      socket.on("noRoom", ({ message }) => {
        history.push("/");
      });
    }
    hostStatus === "member" && join();
  }, []);

  useEffect(() => {
    socket.on("updateRoom", (data) => {
      setPlayersData(data.players);
      setRoomCode(data.code);
    });
  }, []);
  return (
    <div className="container mt-3">
      <h5>This is your roomcode: {roomCode}</h5>
      <h1 style={{ fontFamily: "Piedra" }}>Waiting Room</h1>
      <div className="container border rounded-lg shadow-sm">
        <div className="row justify-content-center">
          <h4 style={{ fontFamily: "Piedra" }}>Players List</h4>
        </div>
        <div className="row justify-content-center">
          {playersData?.map((player, index) => {
            return <PlayerCard player={player} key={index} />;
          })}
        </div>
        <Button type="button-lg mt-3 mb-3">Start Game</Button>
      </div>
    </div>
  );
}

export default LobbyPage;
