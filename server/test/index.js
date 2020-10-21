const io = require("socket.io-client");
const { expect } = require("chai");


  // Host

  // Join

  // Leave

  // describe("Attack test", () => {
  //   before((done) => {
  //     dumSocket1.once("updateRoom", (res) => {
  //       dumSocket2.once("updateRoom", () => {
  //         done();
  //       });
  //       dumSocket2.emit("join", { code: res.code, name: "dummy2" });
  //     });
  //     dumSocket1.emit("host", { name: "dummy1" });
  //   });

  //   after(function (done) {
  //     dumSocket1.emit("nukeDatabase");
  //     dumSocket2.emit("byebye");
  //     dumSocket1.emit("byebye");
  //     done();
  //   });

  //   it("Tes nyerang", (done) => {
  //     dumSocket1.emit("ready");
  //   });
  // });
