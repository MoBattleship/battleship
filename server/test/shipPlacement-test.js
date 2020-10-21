const io = require("socket.io-client");
const { expect } = require("chai");

describe("Leave tests", () => {
  const dumSocket1 = io('http://localhost:4000')
  const dumSocket2 = io('http://localhost:4000')
  let code

  before(function (done) {
    dumSocket1.once('updateRoom', (res) => {
      code = res.code
      dumSocket2.on('updateRoom', (res) => {
        dumSocket1.emit('startGame')
        console.log('game is starting!');
        done()
      })
      dumSocket2.emit('join', { code, name: 'dummy2' })
    })
    dumSocket1.emit('host', { name: 'dummy1' })
  })

  after(function (done) {
    dumSocket1.emit('nukeDatabase')
    dumSocket2.emit('byebye')
    dumSocket1.emit('byebye')
    done()
  })
})