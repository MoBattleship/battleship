const express = require("express");
const app = express();
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const port = process.env.PORT || 4000;

const route = require('./route/')

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/', route)

io.on('connection', socket => {
  console.log('connection!!!');

  socket.on('host', () => {

  })

  socket.on('message', () => {
    io.emit('abc', 'hello')
  })

  socket.on('disconnect', () => {
    console.log('ada yg dc!');
  })
})

http.listen(port, () => console.log("listening on " + port));
