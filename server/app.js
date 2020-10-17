const express = require("express");
const { generateCode } = require("./helpers");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const db = require("./mongo");
const port = process.env.PORT || 4000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

io.on("connection", (socket) => {
  console.log("connection by", socket.id);

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
          name,
          color: colours[0],
        },
      ],
    });
    const newLobby = ops[0];
    socket.join(code);
    socket.emit("updateRoom", newLobby);
  });

  // LEAVE

  socket.on("leave", async (payload) => {
    const { name, code } = payload;
    const room = await db.collection("lobby").findOne({ code });
    if (!room) {
      
    } else if (room.players.length === 1) {
      await db.collection("lobby").deleteOne({ code });
      socket.leave(code);
    } else {
      await db.collection("lobby").updateOne(
        { code },
        {
          $pull: {
            players: {
              name,
            },
          },
        }
      );
      const newRoom = await db.collection("lobby").findOne({ code });
      socket.leave(code);
      newRoom.message = `${name} has left the lobby.`;
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
                name,
                color: colours[room.players.length],
              },
            },
          }
        );
        const joinedRoom = await db.collection("lobby").findOne({ code });
        socket.join(code);
        io.to(code).emit("updateRoom", joinedRoom);
      } else {
        socket.emit("roomFull", {
          message: "The room you're entering is full.",
        });
      }
    } else {
      socket.emit("noRoom", { message: "Room not found." });
    }
  });

  socket.on("message", () => {
    io.emit("abc", "hello");
  });

  socket.on("nukeDatabase", async () => {
    await db.collection("lobby").deleteMany({});
  });

  socket.on("disconnect", () => {
    console.log(socket.id, " disconnected.");
    socket.disconnect();
  });
});

http.listen(port, () => console.log("listening on " + port));
