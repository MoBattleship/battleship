const http = require('../app')
const io = require('socket.io')(http)

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

module.exports = io