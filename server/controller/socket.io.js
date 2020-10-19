const db = require("../mongo");
const { generateCode } = require("../helpers");

module.exports = function(io) {
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
  
    // HOST
  
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
      console.log(socket.id + ' hosted a lobby at ' + code);
      socket.emit("updateRoom", newLobby);
    });
  
    // LEAVE
  
    socket.on("leave", async () => {
      const code = Object.keys(socket.rooms)[1]
      const id = socket.id
      const room = await db.collection("lobby").findOne({ code });
      if (!room) {
        console.log('that');
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
        console.log(socket.id + ' left room ' + code);
        io.to(code).emit("updateRoom", newRoom);
      }
    });
  
    // JOIN
  
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
          console.log(socket.id + ' joined room ' + code);
          io.to(code).emit("updateRoom", joinedRoom);
        } else {
          console.log(socket.id + ' tried to join ' + code + 'but room is full.');
          socket.emit("roomFull", {
            error: true,
            message: "The room you're entering is full.",
          });
        }
      } else {
        console.log(socket.id + ' tried to join ' + code + ' but no such room.');
        socket.emit("noRoom", {
          error: true,
          message: "Room not found.",
        });
      }
    });
  
    // Color change handler
    socket.on('changeColor')

    // Start to board
    socket.on('startGame', async () => {
      const code = Object.keys(socket.rooms)[1]
      const lobby = await db.collection('lobby').findOne({ code })
      socket.to(code).emit('toBoard', lobby)
    })

    socket.on("nukeDatabase", async () => {
      await db.collection("lobby").deleteMany({});
    });
  
    socket.on("byebye", () => {
      console.log(socket.id, "disconnected.");
      socket.disconnect();
    });
  });
}