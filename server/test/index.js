const io = require("socket.io-client");
const { expect } = require("chai");

describe("Socket Tests", () => {
  const dumSocket1 = io("http://localhost:4000");
  const dumSocket2 = io("http://localhost:4000");
  const dumSocket3 = io("http://localhost:4000");
  const dumSocket4 = io("http://localhost:4000");
  const dumSocket5 = io("http://localhost:4000");
  let code;

  after(function (done) {
    dumSocket1.emit("nukeDatabase");
    dumSocket5.emit("byebye");
    dumSocket4.emit("byebye");
    dumSocket3.emit("byebye");
    dumSocket2.emit("byebye");
    dumSocket1.emit("byebye");
    done();
  });

  describe("Host Tests", () => {
    after(function() {
      dumSocket1.emit('leave')
    })
    it("Successful Hosting", function (done) {
      dumSocket1.once("updateRoom", function (res) {
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
        done()
      });
      dumSocket1.emit("host", { name: "dummy1" });
    });
  });

  describe("Join Tests", () => {
    before(function (done) {
      dumSocket1.once("updateRoom", (res) => {
        code = res.code;
        done();
      });
      dumSocket1.emit("host", { name: "dummy1" });
    });

    it("Successsful join", function (done) {
      dumSocket2.once("updateRoom", (res) => {
        expect(res.code).to.have.lengthOf(6, "Code length should be 6");
        expect(res.code).to.be.a("string", "Code data type should be string");
        expect(res.players).to.have.lengthOf(
          2,
          "Number of players should be 2"
        );
        expect(res.players).to.be.an(
          "array",
          "Players data should be an array"
        );
        expect(res.players[1].name).to.be.equal(
          "dummy2",
          'First player\'s name should be "dummy1"'
        );
        dumSocket3.emit("join", { code, name: "dummy3" });
        dumSocket4.emit("join", { code, name: "dummy4" });
        done();
      });
      dumSocket2.emit("join", { code, name: "dummy2" });
    });

    it("Wrong room code", function (done) {
      dumSocket3.once("noRoom", (res) => {
        expect(res.error).to.be.a("boolean", "Error type should be boolean");
        expect(res.error).to.be.equal(
          true,
          "If wrong code entered, error should be true"
        );
        expect(res.message).to.be.equal("Room not found.");
        done();
      });
      dumSocket3.emit("join", { code: "[]{}()", name: "dummy3" });
    });

    it("Room full", function (done) {
      dumSocket5.once("roomFull", (res) => {
        expect(res.error).to.be.a("boolean", "Error type should be boolean");
        expect(res.error).to.be.equal(
          true,
          "If wrong code entered, error should be true"
        );
        expect(res.message).to.be.equal("The room you're entering is full.");
        done();
      });
      dumSocket5.emit("join", { code, name: "dummy5" });
    });
  });

  describe("Leave tests", () => {
    before(function (done) {
      dumSocket1.once("updateRoom", (res) => {
        code = res.code;
        dumSocket2.once("updateRoom", (res) => {
          done();
        });
        dumSocket2.emit("join", { code, name: "dummy2" });
      });
      dumSocket1.emit("host", { name: "dummy1" });
    });

    after(function (done) {
      dumSocket1.emit("nukeDatabase");
      dumSocket2.emit("byebye");
      dumSocket1.emit("byebye");
      done();
    });

    it("Successful leaving", function (done) {
      dumSocket2.emit("leave");
      dumSocket1.on("updateRoom", (res) => {
        expect(res.players).to.be.lengthOf(
          1,
          "After someone leave, player number should be reduced by 1"
        );
        done();
      });
    });
  });

  describe("Ship Placement Tests", () => {
  });

  describe("Attack test", () => {
    before((done) => {
      dumSocket1.once("updateRoom", (res) => {
        dumSocket2.once("updateRoom", () => {
          done();
        });
        dumSocket2.emit("join", { code: res.code, name: "dummy2" });
      });
      dumSocket1.emit("host", { name: "dummy1" });
    });

    after(function (done) {
      dumSocket1.emit("nukeDatabase");
      dumSocket2.emit("byebye");
      dumSocket1.emit("byebye");
      done();
    });

    it("Tes nyerang", (done) => {
      dumSocket1.emit("ready");
    });
  });
});
