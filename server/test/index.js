const io = require("socket.io-client");
const { expect } = require("chai");
const db = require("../mongo/test");

describe("Socket - Lobby System", function () {
  let socket;
  let dummySocket
  let code
  before((done) => {
    socket = io("http://localhost:4000");
    dummySocket = io('http://localhost:4000')
    done();
  });

  after((done) => {
    socket.disconnect();
    dummySocket.disconnect()
    db.collection('lobby').deleteMany()
    done();
  });

  describe("Host Tests", () => {
    it("Host - Success Hosting", function (done) {
      socket.emit("host", {name: 'izra'});
      socket.on("hostResponse", (res) => {
        code = res.code
        expect(res.code).to.have.lengthOf(6)
        expect(res.code).to.be.a('string')
        expect(res.players).to.be.an('array')
        done();
      });
    });
  });

  describe('Join Test', () => {
    it("Join - Success Joining", (done) => {
      dummySocket.emit('join', {code, name: 'imATest'})
      dummySocket.on('joined', (res) => {
        console.log(res);
        expect(res.players).to.have.lengthOf(2)
        expect(res.players[1].name).to.be.equal('imATest')
        done()
      })
    })
  })
});
