const db = require("../mongo");
const { generateCode, generateCoordinate } = require("../helpers");
let boards = [];

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
      if (!room) {
        console.log("that");
      } else if (room.players.length === 1) {
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
    socket.on("changeColor", async (color) => {
      const code = Object.keys(socket.rooms)[1];
      const socketId = socket.id;
      const lobby = await db.collection("lobby").findOneAndUpdate(
        { code, players: { socketId } },
        {
          $set: {
            players: {
              color
            },
          },
        }
      );
      console.log(lobby);
      
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

      const coordinates = {
        socketId: socket.id,
        coordinates: {
          ships: payload,
          bombCount: [specials[0], specials[1]],
          bombPower: specials[2],
          atlantis: specials[3],
        },
      };

      boards.push(coordinates);
      console.log(boards.length, lobby.players.length);

      if (boards.length === lobby.players.length) {
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
        boards = []
      }
    });

    socket.on("nukeDatabase", async () => {
      await db.collection("lobby").deleteMany({});
    });

    socket.on("byebye", () => {
      console.log(socket.id, "disconnected.");
      socket.disconnect();
    });
  });
};
