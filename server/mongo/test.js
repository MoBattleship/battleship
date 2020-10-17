const { MongoClient } = require('mongodb')

const url = 'mongodb://localhost:27017'

const client = new MongoClient(url, { useUnifiedTopology: true })

client.connect()

const db = client.db('battleship-test')

module.exports = db