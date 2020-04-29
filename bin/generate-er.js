const { writeFileSync } = require('fs')
const Sequelize = require('sequelize')
const sequelizeErd = require('sequelize-erd')
require('../config.js')

const date = new Date().toISOString()

;(async function () {
  const { mainDb } = require('../server/database/main_connection.js')
  require('../server/models')

  const svg = await sequelizeErd({ source: mainDb }) // sequelizeErd() returns a Promise
  writeFileSync(`./server/database/ers/${date}.svg`, svg)
})()
