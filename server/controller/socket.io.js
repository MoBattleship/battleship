const db = require("../mongo");
const { generateCode, generateCoordinate } = require("../helpers");
let boards = [];
let attackers = {};

module.exports = function (io) {
  io.on("connection", (socket) => {
    const colours = [
      "#f9ca24",
      "#e84118",
      "#3742fa",
      "#4834d4",
      "#f5f6fa",
      "#fff200",
      "#f8a5c2",
    ];

    // Host game

    socket.on("host", async (payload) => {
      const { name } = payload;
      let code = generateCode();
      let room = await db.collection("lobby").findOne({ code });

      while (room) {
        code = generateCode();
        room = await db.collection("lobby").findOne({ code });
      }

      const { ops } = await db.collection("lobby").insertOne({
        code,
        players: [
          {
            socketId: socket.id,
            name,
            color: colours[0],
          },
        ],
      });
      const newLobby = ops[0];
      socket.join(code);
      console.log(socket.id + " hosted a lobby at " + code);
      socket.emit("updateRoom", newLobby);
    });

    // Leave game

    socket.on("leave", async () => {
      const code = Object.keys(socket.rooms)[1];
      const id = socket.id;
      const room = await db.collection("lobby").findOne({ code });
      if (room) {
        if (room.players.length === 1) {
          await db.collection("lobby").deleteOne({ code });
          socket.leave(code);
        } else {
          await db.collection("lobby").updateOne(
            { code },
            {
              $pull: {
                players: {
                  socketId: id,
                },
              },
            }
          );
          const newRoom = await db.collection("lobby").findOne({ code });
          socket.leave(code);
          console.log(socket.id + " left room " + code);
          io.to(code).emit("updateRoom", newRoom);
        }
      }
    });

    // Join game

    socket.on("join", async (payload) => {
      const { code, name } = payload;
      const room = await db.collection("lobby").findOne({ code });
      if (room) {
        if (room.players.length < 4) {
          await db.collection("lobby").findOneAndUpdate(
            { code },
            {
              $push: {
                players: {
                  socketId: socket.id,
                  name,
                  color: colours[room.players.length],
                },
              },
            }
          );
          const joinedRoom = await db.collection("lobby").findOne({ code });
          socket.join(code);
          console.log(socket.id + " joined room " + code);
          io.to(code).emit("updateRoom", joinedRoom);
        } else {
          console.log(
            socket.id + " tried to join " + code + "but room is full."
          );
          socket.emit("roomFull", {
            error: true,
            message: "The room you're entering is full.",
          });
        }
      } else {
        console.log(
          socket.id + " tried to join " + code + " but no such room."
        );
        socket.emit("noRoom", {
          error: true,
          message: "Room not found.",
        });
      }
    });

    // Color change handler
    socket.on("changeColor", async ({ selectedColour }) => {
      const socketId = socket.id;
      const code = Object.keys(socket.rooms)[1];
      // const socketId = socket.id;
      await db.collection("lobby").updateOne(
        {
          $and: [
            { code },
            {
              players: {
                $elemMatch: { socketId },
              },
            },
          ],
        },
        {
          $set: {
            "players.$.color": selectedColour,
          },
        },
        {
          returnOriginal: false,
        }
      );
      const lobby = await db.collection("lobby").findOne({ code });
      io.to(code).emit("updateRoom", lobby);
    });

    // Start to board
    socket.on("startGame", async () => {
      const code = Object.keys(socket.rooms)[1];
      let lobby = await db.collection("lobby").findOne({ code });
      console.log("Game in room", code, "is starting");
      socket.to(code).emit("toBoard", lobby);
    });

    // Save ships coordinates
    socket.on("ready", async ({ temp: payload }) => {
      console.log(socket.id, "has placed their ships");
      let specials = [];
      const code = Object.keys(socket.rooms)[1];
      const lobby = await db.collection("lobby").findOne({ code });

      while (true) {
        let generated = generateCoordinate();
        let isBooked = false;

        // cek kapal
        for (ship of payload) {
          ship.coordinates.forEach((coordinate) => {
            if (`${generated}` === `${coordinate}`) {
              isBooked = true;
            }
          });
        }

        if (isBooked) {
          continue;
        }

        // cek special yg lain
        specials.forEach((coordinate) => {
          if (`${generated}` === `${coordinate}`) {
            isBooked = true;
          }
        });

        if (isBooked) {
          continue;
        }

        specials.push(generated);
        if (specials.length === 4) {
          break;
        }
      }

      const [playerProfile] = lobby.players.filter(
        (player) => player.socketId === socket.id
      );

      socket
        .to(code)
        .emit("announcement", `${playerProfile.name} has placed their ships`);

      payload.forEach((ship) => {
        ship.isAlive = true;
      });

      const coordinates = {
        socketId: socket.id,
        name: playerProfile.name,
        color: playerProfile.color,
        activePowers: {
          bombCount: 1,
          power: false,
        },
        isLose: false,
        coordinates: {
          ships: payload,
          bombCount: [specials[0], specials[1]],
          bombPower: specials[2],
          atlantis: specials[3],
          attacked: [],
        },
      };

      boards.push(coordinates);
      if (!attackers[code]) {
        attackers[code] = {
          hasAttacked: 0,
          defendants: [],
        };
      }
      attackers[code].defendants.push({ socketId: socket.id, underFire: [] });

      if (boards.length === lobby.players.length) {
        console.log("All players have placed their ships");
        socket
          .to(code)
          .emit("announcement", "All players have placed their ships");
        const startBoardLog = [boards];
        await db.collection("lobby").updateOne(
          { code },
          {
            $set: {
              boardLogs: startBoardLog,
            },
          }
        );
        io.to(code).emit("allBoards", boards);
        boards = [];
      }
    });

    // Resolving each attacks
    socket.on("resolveAttacks", async (bombs) => {
      console.log(socket.id + " has sent their attacks.");
      const code = Object.keys(socket.rooms)[1];
      const lobby = await db.collection("lobby").findOne({ code });
      let lastBoard = lobby.boardLogs[lobby.boardLogs.length - 1];
      const [playerProfile] = lastBoard.filter(
        (player) => player.socketId === socket.id
      );
      const name = playerProfile.name;
      socket.to(code).emit("announcement", `${name} has sent their attacks.`);

      attackers[code].hasAttacked += 1;
      attackers[code].defendants.forEach((attack) => {
        bombs.forEach((bomb) => {
          if (attack.socketId === bomb.socketId) {
            attack.underFire.push({
              from: socket.id,
              coordinate: bomb.coordinate,
            });
          }
        });
      });

      // Check loser
      const lastBoardCount = lastBoard.filter(player => player.isLose === false);
      const playerCount = lastBoardCount.length

      if (attackers[code].hasAttacked === playerCount) {
        io.to(code).emit("resolving");

        lastBoard = lastBoard.map((boardOfSocket) => {
          attackers[code].defendants.forEach((attack) => {
            if (boardOfSocket.socketId === attack.socketId) {
              attack.underFire.forEach((coor) => {
                boardOfSocket.coordinates.attacked.push(coor)
              });
            }
          });
          return boardOfSocket;
        });
        console.log("Resolving for every hits...");

        // Check every players of any sunk ship and special hits
        lastBoard.forEach((player) => {
          let { coordinates } = player;
          let { attacked, ships, bombCount, bombPower, atlantis } = coordinates;

          // Check bomb hit
          attacked.forEach((point) => {
            ships.forEach((ship) => {
              ship.coordinates.forEach((coordinate) => {
                if (`${point.coordinate}` === `${coordinate}`) {
                  ship.isAlive = false;
                }
              });

              // Check is the player is lose or not
              let aliveShip = ships.filter((ship) => ship.isAlive === true);
              if (aliveShip.length === 0) {
                player.isLose = true;
              }
            });

            // Check Bomb Count
            bombCount.forEach((bc, i) => {
              if (`${point.coordinate}` === `${bc}`) {
                lastBoard.forEach((receiver) => {
                  if (receiver.socketId === point.from) {
                    receiver.activePowers.bombCount += 1;
                    i === 0 ? bombCount.shift() : bombCount.pop()
                    io.to(code).emit('bombCount', `${receiver.name} picked up the Bomb Count bonus`)
                  }
                });
              }
            });

            // Check Power
            if (`${point.coordinate}` === `${bombPower}`) {
              lastBoard.forEach((receiver) => {
                if (receiver.socketId === point.from) {
                  receiver.activePowers.bombPower = true;
                  io.to(code).emit('power', `${receiver.name} picked up the Power bonus!`)
                  bombPower = []
                }
              });
            }

            if (`${point.coordinate}` === `${atlantis}`) {
              lastBoard.forEach((receiver) => {
                if (receiver.socketId === point.from) {
                  receiver.isLose = true;
                  io.to(code).emit("atlantisHit", {
                    socketId: receiver.socketId,
                  });
                }
              });
            }
          });

          // Check winner
          const winner = lastBoard.filter(
            (playerCheckWinner) => playerCheckWinner.isLose === false
          );
          if (winner.length === 1) {
            io.to(code).emit("winner", winner);
          }
        });

        await db.collection("lobby").updateOne(
          { code },
          {
            $push: {
              boardLogs: lastBoard,
            },
          }
        );

        console.log("Hits resolved. Sending to client...");
        io.to(code).emit("resolved", lastBoard);
        attackers[code].hasAttacked = 0
        attackers[code].defendants.forEach((player) => {
          player.underFire = [];
        });
      }
    });

    // CHATBOX
    // Send message
    socket.on("chatMessage", (data) => {
      socket
        .to(Object.keys(socket.rooms)[1])
        .broadcast.emit("chatMessage", data);
    });

    // Check typing
    socket.on("typing", (data) => {
      socket.to(Object.keys(socket.rooms)[1]).broadcast.emit("typing", data);
    });

    // Check stop typing
    socket.on("stopTyping", () => {
      socket.to(Object.keys(socket.rooms)[1]).broadcast.emit("stopTyping");
    });

    // For testing purpose

    socket.on("nukeDatabase", async () => {
      await db.collection("lobby").deleteMany({});
      attackers = {};
      boards = [];
    });

    socket.on("byebye", () => {
      console.log(socket.id, "disconnected.");
      socket.disconnect();
    });
  });
};
