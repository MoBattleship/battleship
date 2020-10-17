const io = require("socket.io-client");
const { expect } = require("chai");
const db = require("../mongo/test");

describe("Socket - Lobby System", function () {
  let socket;
  before((done) => {
    socket = io("http://localhost:3000");
    done();
  });

  after((done) => {
    socket.disconnect();
    db.collection('lobby').deleteMany()
    done();
  });

  describe("Host Tests", () => {
    it("Host - Success Hosting", function (done) {
      socket.emit("host", {name: 'izra'});
      socket.on("hostResponse", (res) => {
        expect(res.code).to.have.lengthOf(6)
        expect(res.code).to.be.a('string')
        expect(res.players).to.be.an('array')
        done();
      });
    });
  });

  describe('Join Test', () => {
    it("Join - Success Joining", (done) => {
      const dummySocket = io('http://localhost:3000')
      socket.emit('host', {name: 'dummyhost'})
      socket.on('hostResponse', (res) => {
        dummySocket.emit('join')
      })
    })
  })
});
