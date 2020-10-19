const randomstring = require('randomstring')

const generateCode = () => {
  const code = randomstring.generate({
    length: 6,
    charset: 'alphanumeric',
    capitalization: 'uppercase'
  })
  return code
}

const generateCoordinate = () => {
  const col = Math.ceil(Math.random() * 15)
  const row = Math.ceil(Math.random() * 15)
  return [row, col]
}

module.exports = {
  generateCode,
  generateCoordinate
}