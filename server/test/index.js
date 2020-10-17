const io = require("socket.io-client");
const { expect } = require("chai");

describe("Socket - Lobby System", function () {
  let dummySocket1 = io("http://localhost:4000");
  let dummySocket2 = io("http://localhost:4000");
  let code;

  after(function(done) {
    dummySocket1.emit("nukeDatabase");
    dummySocket1.disconnect();
    done()
  });

  describe("Host Tests", () => {
    after(function(done) {
      dummySocket1.emit("leave", { code, name: "dummy1" });
      done();
    });

    it("Host - Success Hosting", function (done) {
      dummySocket1.emit("host", { name: "dummy1" });
      dummySocket1.on("hostResponse", function(res) {
        code = res.code;
        expect(res.code).to.have.lengthOf(6);
        expect(res.code).to.be.a("string");
        expect(res.players).to.be.an("array");
        done()
      });
    });
  });

  describe("Join Test", () => {
    let dummySocket3 = io("http://localhost:4000");
    let dummySocket4 = io("http://localhost:4000");
    let dummySocket5 = io("http://localhost:4000");

    before(function(done) {
      dummySocket1.emit("host", { name: "dummy1" });
      dummySocket1.on("hostResponse", function(res) {
        code = res.code;
      });
      done();
    });

    after(function(done) {
      dummySocket5.disconnect()
      dummySocket4.disconnect()
      dummySocket3.disconnect()
      dummySocket2.emit("leave", { name: "dummy2" });
      dummySocket1.emit("leave", { name: "dummy1" });
      done()
    });

    it("Join - Success Joining", function(done) {
      dummySocket2.emit("join", { code, name: "dummy2" });
      dummySocket2.on("joined", function(res) {
        expect(res.players).to.have.lengthOf(4);
        expect(res.players[1].name).to.be.equal("dummy1");
      });
      dummySocket1.on("joined", function(res) {
        expect(res.players).to.have.lengthOf(2);
        expect(res.players[0].name).to.be.equal("dummy1");
        expect(res.players[1].name).to.be.equal("dummy2");
      });
      done();
    });

    it("Join - Room Not Found", function(done) {
      dummySocket5.emit("join", { code: "<><><>", name: "sadDummy" });
      dummySocket5.on("noRoom", function(res) {
        expect(res.message).to.be.equal("Room not found.");
      });
      done();
    });

    it("Join - Room Full", function(done) {
      dummySocket3.emit("join", { code, name: "dummy3" });
      dummySocket4.emit("join", { code, name: "dummy4" });
      dummySocket5.emit("join", { code, name: "sadDummy" });
      dummySocket5.on('joined', function(res) {
        console.log(res, '___________');
      })
      dummySocket5.on("roomFull", function(res) {
        console.log(res, ">>>>>>>>>>>>>");
        expect(res.message).to.be.equal("The room you're entering is ull.");
        done()
      });
      done();
    });
  });

  // describe("Leave Test", () => {
  //   before = async function(done) {
  //     dummySocket1.emit('host', { name: 'dummy1' })
  //     dummySocket1.on('hostResponse', function(res) {
  //       code = res.code
  //       done()
  //     })
  //     dummySocket2.emit('join', { code, name: 'dummy2' })
  //     done()
  //   }

  //   after = async function(done) {
  //     dummySocket2.disconnect()
  //     done()
  //   }
    
  //   it("Leave - Success Leaving", function(done) {
  //     dummySocket2.emit("leave", { code, name: "dummy2" });
  //     dummySocket1.on("updateRoom", function(res) {
  //       console.log(res, "<<<<<");
  //       expect(res.players).to.have.lengthOf(1);
  //       expect(res.message).to.be.equal("dummy2 has left the lobby.");
  //       done()
  //     });
  //   });
  // });
});
