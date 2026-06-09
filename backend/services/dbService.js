const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, '../data/events.json')

function readData() {
  const raw = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(raw)
}

function writeData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}

module.exports = { readData, writeData }
