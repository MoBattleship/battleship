const { expect } = require("chai");
const { generateCode, generateCoordinate } = require("../helpers");

describe('Helpers Tests', () => {
  it('Generate Code for Room', function() {
    const code = generateCode()
    expect(code).to.be.a('string', 'Code from room should be a string')
    expect(code).to.have.lengthOf(6, 'Code should have 6 characters')
  })

  it('Generate Coordinate for Specials', function() {
    const coordinate = generateCoordinate()
    expect(coordinate).to.be.an('array', 'Coordinate should be an array')
    expect(coordinate).to.have.lengthOf(2, 'Coordinate length should be 2')
  })
})