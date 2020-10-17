const express = require("express");
const { generateCode } = require("./helpers");
const app = express();
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const db = require('./mongo')
const port = process.env.PORT || 3000;

const route = require('./route/')

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/', route)

io.on('connection', socket => {
  console.log('connection!!!');

  socket.on('host', async (res) => {
    const {name, color} = res
    const code = generateCode()
    const {ops} = await db.collection('lobby').insertOne({
      code,
      players: [{
        name,
        color
      }]
    })
    const newLobby = ops[0]
    socket.emit('hostResponse', newLobby)
    socket.join(code)
  })

  socket.on('join', () => {
    
  })

  socket.on('message', () => {
    io.emit('abc', 'hello')
  })

  socket.on('disconnect', () => {
    console.log('ada yg dc!');
  })
})

http.listen(port, () => console.log("listening on " + port));
