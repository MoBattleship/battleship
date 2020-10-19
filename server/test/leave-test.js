const io = require("socket.io-client");
const { expect } = require("chai");

describe('Leave tests', () => {
  const dumSocket1 = io('http://localhost:4000')
  const dumSocket2 = io('http://localhost:4000')
  let code

  before(function(done) {
    dumSocket1.once('updateRoom', (res) => {
      code = res.code
      dumSocket2.once('updateRoom', (res) => {
        done()
      })
      dumSocket2.emit('join', { code, name: 'dummy2' })
    })
    dumSocket1.emit('host', { name: 'dummy1'})
  })

  after(function(done) {
    dumSocket1.emit('nukeDatabase')
    dumSocket2.emit('byebye')
    dumSocket1.emit('byebye')
    done()
  })

  it('Successful leaving', function(done) {
    dumSocket2.emit('leave')
    dumSocket1.on('updateRoom', (res) => {
      expect(res.players).to.be.lengthOf(1, 'After someone leave, player number should be reduced by 1')
      done()
    })
  })
})