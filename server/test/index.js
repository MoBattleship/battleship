const io = require("socket.io-client");
const { expect, assert, should } = require("chai");

describe("Socket-Server", function () {
  let socket;
  before((done) => {
    socket = io("http://localhost:3000");
    done();
  });

  after((done) => {
    socket.disconnect();
    done();
  });

  describe("Test", () => {
    it("Host - Response", function (done) {
      socket.emit("host", {name: 'izra', color: 'red'});
      socket.on("hostResponse", (res) => {
        expect(res.code).to.have.lengthOf(6)
        expect(res.code).to.be.a('string')
        expect(res.players).to.be.an('array')
        done();
      });
    });

    
  });
});
