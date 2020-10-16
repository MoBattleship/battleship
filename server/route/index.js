const { generateCode } = require('../helpers')

const route = require('express').Router()


route.get('/host', (req, res) => {
  console.log(generateCode())
})

module.exports = route