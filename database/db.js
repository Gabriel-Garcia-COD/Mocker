const { Sequelize } = require("sequelize")
require('dotenv').config()

const database = process.env.DB_TABLE_NAME
const username = process.env.DB_USERNAME
const password = process.env.DB_PASSWORD
const hostAddress = process.env.DB_HOST
const port = process.env.DB_PORT

const db = new Sequelize(database, username, password, {
    port: port,
    host: hostAddress,
    dialect: 'postgres'
})

module.exports = db