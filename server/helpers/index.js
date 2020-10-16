const randomstring = require('randomstring')

const generateCode = () => {
  const code = randomstring.generate({
    length: 6,
    charset: 'alphanumeric',
    capitalization: 'uppercase'
  })
  return code
}

module.exports = {
  generateCode
}