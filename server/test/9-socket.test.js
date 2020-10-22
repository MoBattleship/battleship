const testio = require("../controller/socket.io");
const sinon = require("sinon");
const { expect } = require("chai");

describe("Dummy Test", () => {
  it("should dummy test", () => {
    const io = {
      on: sinon.spy(),
    };

    testio(io);

    expect(io.on.calledOnce).to.be.true;

    expect(io.on.firstcall.args[0]).to.be.equal("connection");
    expect(io.on.firstcall.args[1]).to.be.a("function");
  });

  it("should dummy test 2", () => {
    const stub = sinon.stub;
    const socket = sinon.spy();

    const io = {
      on(test, callbackFn) {
        const socket = {
          on: sinon.spy(),
        };

        callbackFn(socket);

        expect(socket.on.callCount).to.be.equal(12);

        const equals = ['host', 'leave', 'join', 'changeColor', 'startGame', 'ready', 'resolveAttacks','chatMessage', 'typing', 'stopTyping', 'nukeDatabase', 'byebye']

        // for (let i = 0; i < equals.length; i++) {
        //   let spycal = socket.on.getCall(i)

        //   expect(spycal.args[0]).to.be.equal(equals[i])
        //   expect(spycal.args[1].to.be.a('function'))
        // }

        const spycal0 = socket.on.getCall(0);

        expect(spycal0.args[0]).to.be.equal(equals[0]);
        expect(spycal0.args[1]).to.be.a("function");

        const spycal1 = socket.on.getCall(1);

        expect(spycal1.args[0]).to.be.equal(equals[1]);
        expect(spycal1.args[1]).to.be.a("function");

        const spycal2 = socket.on.getCall(2);

        expect(spycal2.args[0]).to.be.equal(equals[2]);
        expect(spycal2.args[1]).to.be.a("function");

        const spycal3 = socket.on.getCall(3);

        expect(spycal3.args[0]).to.be.equal(equals[3]);
        expect(spycal3.args[1]).to.be.a("function");

        const spycal4 = socket.on.getCall(4);

        expect(spycal4.args[0]).to.be.equal(equals[4]);
        expect(spycal4.args[1]).to.be.a("function");

        const spycal5 = socket.on.getCall(5);

        expect(spycal5.args[0]).to.be.equal(equals[5]);
        expect(spycal5.args[1]).to.be.a("function");

        const spycal6 = socket.on.getCall(6);

        expect(spycal6.args[0]).to.be.equal(equals[6]);
        expect(spycal6.args[1]).to.be.a("function");

        const spycal7 = socket.on.getCall(7);

        expect(spycal7.args[0]).to.be.equal(equals[7]);
        expect(spycal7.args[1]).to.be.a("function");

        const spycal8 = socket.on.getCall(8);

        expect(spycal8.args[0]).to.be.equal(equals[8]);
        expect(spycal8.args[1]).to.be.a("function");

        const spycal9 = socket.on.getCall(9);

        expect(spycal9.args[0]).to.be.equal(equals[9]);
        expect(spycal9.args[1]).to.be.a("function");

        const spycal10 = socket.on.getCall(10);

        expect(spycal10.args[0]).to.be.equal(equals[10]);
        expect(spycal10.args[1]).to.be.a("function");

        const spycal11 = socket.on.getCall(11);

        expect(spycal11.args[0]).to.be.equal(equals[11]);
        expect(spycal11.args[1]).to.be.a("function");
      },
    };

    testio(io);
  });
});
