const io = require("socket.io-client");
const { expect } = require("chai");

describe("Attacking Tests", () => {
  const dumSocket1 = io("http://localhost:4000");
  const dumSocket2 = io("http://localhost:4000");
  let dummyBoard = [
    {
      shipName: "a",
      length: 5,
      coordinates: [
        [1, 1],
        [1, 2],
        [1, 3],
        [1, 4],
        [1, 5],
      ],
    },
    {
      shipName: "b",
      length: 4,
      coordinates: [
        [2, 1],
        [2, 2],
        [2, 3],
        [2, 4],
      ],
    },
    {
      shipName: "c",
      length: 3,
      coordinates: [
        [3, 1],
        [3, 2],
        [3, 3],
      ],
    },
    {
      shipName: "d",
      length: 3,
      coordinates: [
        [4, 1],
        [4, 2],
        [4, 3],
      ],
    },
    {
      shipName: "e",
      length: 2,
      coordinates: [
        [5, 1],
        [5, 2],
      ],
    },
  ];
  let allBoards = [];

  before(function (done) {
    dumSocket2.once("allBoards", (res) => {
      allBoards = res;
      done();
    });
    dumSocket1.once("updateRoom", ({ code }) => {
      dumSocket2.once("updateRoom", () => {
        dumSocket1.emit("startGame");
        dumSocket1.emit("ready", { temp: dummyBoard });
        dumSocket2.emit("ready", { temp: dummyBoard });
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

  it("No hits", function (done) {
    let dummyAttack1 = [
      {
        socketId: dumSocket2.id,
        coordinate: [1, 1]
      }
    ]
    let dummyAttack2 = [
      {
        socketId: dumSocket1.id,
        coordinate: [2, 2]
      }
    ]
    dumSocket2.on("resolved", (res) => {
      console.log(res, "ini resnya");
      done();
    });
    console.log(dumSocket1.id, 'socket 1');
    console.log(dumSocket2.id, 'socket 2');
    dumSocket1.emit('resolveAttacks', dummyAttack1)
    dumSocket2.emit('resolveAttacks', dummyAttack2)
  });
});
