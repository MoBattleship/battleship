const io = require("socket.io-client");
const { expect } = require("chai");

describe("Host Tests", () => {
  const dummySocket1 = io("http://localhost:4000");

  after(function (done) {
    dummySocket1.emit("nukeDatabase");
    dummySocket1.emit("byebye");
    done();
  });

  it("Successful Hosting", function (done) {
    dummySocket1.on("updateRoom", function (res) {
      const code = res.code;
      const players = res.players;
      expect(code).to.have.lengthOf(6, "Code length should be 6");
      expect(code).to.be.a("string", "Code data type should be string");
      expect(players).to.have.lengthOf(1, "Number of players should be 1");
      expect(players).to.be.an("array", "Players data should be an array");
      expect(players[0].name).to.be.equal(
        "dummy1",
        'First player\'s name should be "dummy1"'
      );
      done();
    });
    dummySocket1.emit("host", { name: "dummy1" });
  });
});
