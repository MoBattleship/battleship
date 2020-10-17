const express = require("express");
const { generateCode } = require("./helpers");
const app = express();
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const db = require('./mongo')
const port = process.env.PORT || 4000;


const route = require("./route/");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/", route);

io.on("connection", (socket) => {
  console.log("connection!!!");

  const colours = [
    "#f9ca24",
    "#e84118",
    "#3742fa",
    "#4834d4",
    "#f5f6fa",
    "#fff200",
    "#f8a5c2",
  ];

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
    socket.emit("hostResponse", newLobby);
    socket.join(code);
  });

  socket.on('leave', async (payload) => {
    const { name, code } = payload
    const room = await db.collection('lobby').findOne({ code })
    if (room.players.length === 1) {
      await db.collection('lobby').deleteOne({ code })
      socket.leave(code)
    } else {
      const newRoom = await db.collection('lobby').updateOne({ code }, {
        $pull: {
          players: {
            $in: [
              {
                name
              }
            ]
          }
        }
      })
      socket.leave(code)
      socket.to(code).emit('updateRoom', newRoom)
      socket.to(code).emit('leaveMessage', `${name} has left the lobby.`)
    }
  })

  socket.on("join", async (payload) => {
    // const {code, name} = 
  });

  socket.on("message", () => {
    io.emit("abc", "hello");
  });

  socket.on("disconnect", () => {
    console.log("ada yg dc!");
  });
});

http.listen(port, () => console.log("listening on " + port));
