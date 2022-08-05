'use strict'

const fs = require('fs')
const path = require('path')
const files = fs.readdirSync(path.join(__dirname))

for (let file of files) {
    const fileName = file.split('.').slice(0, -1).join('.')
    if (fileName && fileName !== 'index') {
        module.exports[fileName] = require(`./${fileName}`)
    }
}
