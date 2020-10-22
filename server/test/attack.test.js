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
    dumSocket2.once("toBoard", () => {
      dumSocket1.emit("ready", { temp: dummyBoard });
      dumSocket2.emit("ready", { temp: dummyBoard });
    });
    dumSocket1.once("updateRoom", ({ code }) => {
      dumSocket2.once("updateRoom", () => {
        dumSocket1.emit("startGame");
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

  it("1st Attacks - No hits", function (done) {
    let dummyAttack1 = [
      {
        socketId: dumSocket2.id,
        coordinate: [14, 1],
      },
    ];
    let dummyAttack2 = [
      {
        socketId: dumSocket1.id,
        coordinate: [15, 2],
      },
    ];
    dumSocket2.once("resolved", (res) => {
      res.forEach((player) => {
        player.coordinates.ships.forEach((ship) => {
          expect(ship.isAlive).to.be.equal(true, "All ships should be alive");
        });
      });
      expect(res[0].coordinates.attacked).to.have.lengthOf(1);
      expect(res[0].coordinates.attacked[0].coordinate).to.be.an(
        "array",
        "Attacked data type should be an array"
      );
      expect(res[0].coordinates.attacked[0].coordinate[0]).to.be.equal(
        15,
        "Attacked row should be 15"
      );
      expect(res[0].coordinates.attacked[0].coordinate[1]).to.be.equal(
        2,
        "Attacked column should be 2"
      );
      done();
    });
    dumSocket1.emit("resolveAttacks", dummyAttack1);
    dumSocket2.emit("resolveAttacks", dummyAttack2);
  });

  it("2nd Attack - Hit A Ship", function (done) {
    dumSocket2.once("resolved", (res) => {
      expect(res[0].coordinates.attacked[1].coordinate[0]).to.be.equal(1, 'Attacked row should be 1')
      expect(res[0].coordinates.attacked[1].coordinate[1]).to.be.equal(1, 'Attacked column should be 1')
      expect(res[0].coordinates.ships[0].isAlive).to.be.equal(false, `${res[0].coordinates.ships[0].shipName} isAlive property should be false`)
      done()
    });
    let dummy1AttackToSocket2 = [
      {
        socketId: dumSocket2.id,
        coordinate: [14, 2],
      },
    ];
    let dummy2AttackToSocket1 = [
      {
        socketId: dumSocket1.id,
        coordinate: [1, 1],
      },
    ];
    dumSocket1.emit("resolveAttacks", dummy1AttackToSocket2);
    dumSocket2.emit("resolveAttacks", dummy2AttackToSocket1);
  });

  // it('2nd attack wave', function(done) {

  // })
});
