const io = require("socket.io-client");
const { expect } = require("chai");

describe("Leave tests", () => {
  const dumSocket1 = io('http://localhost:4000')
  const dumSocket2 = io('http://localhost:4000')
  let code

  before(function (done) {
    dumSocket1.once('updateRoom', (res) => {
      code = res.code
      dumSocket2.once('updateRoom', (res) => {
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

  it('Successful placing', function(done) {
    let dummyBoard = [
      {
        shipName: 'a',
        length: 5,
        coordinates: [[1,1], [1,2], [1,3],[1,4],[1,5]]
      },
      {
        shipName: 'b',
        length: 4,
        coordinates: [[2,1], [2,2], [2,3],[2,4]]
      },
      {
        shipName: 'c',
        length: 3,
        coordinates: [[3,1], [3,2], [3,3]]
      },
      {
        shipName: 'd',
        length: 3,
        coordinates: [[4,1], [4,2], [4,3]]
      },
      {
        shipName: 'e',
        length: 2,
        coordinates: [[5,1], [5,2]]
      }
    ]
    dumSocket2.once('allBoards', (res) => {
      console.log(res, 'ini resnya');
      expect(res).to.have.lengthOf(2, 'Boards length received should be 2')
      // expect(res.)
      done()
    })
    dumSocket1.emit('ready', { temp: dummyBoard })
    dumSocket2.emit('ready', { temp: dummyBoard })
  })
})