const io = require("socket.io-client");
const { expect, assert, should } = require("chai");

describe("Socket-Server", function () {
  let socket;
  beforeEach((done) => {
    socket = io("http://localhost:3000");
    done();
  });

  afterEach((done) => {
    socket.disconnect();
    done();
  });

  describe("Test", () => {
    it("Message test", function (done) {
      socket.emit("message");
      socket.on("abc", (message) => {
        console.log(message, "ini dari test");
        assert(message === "hello", "message should be hello");
        done();
      });
    });
  });
});
