'use strict'
const fs = require('fs')
const paramCase = require('param-case')

const definitions = {}

const setDefaults = (data, fileName) => {
    let item = {
        name: null,
        definition: {}
    }

    if (data.definition) {
        item.name = data.name || paramCase(fileName)
        item.definition.type = data.definition.type || 'object'
        item.definition.properties = data.definition.properties
    } else if (data.properties) {
        item.name = data.name || paramCase(fileName)
        item.definition.type = data.type || 'object'
        item.definition.properties = data.properties
    } else {
        item.name = paramCase(fileName)
        item.definition.properties = data
        item.definition.type = 'object'
    }
    return item
};

(function () {
    fs.readdirSync(__dirname).forEach(function (file) {
        if (file.indexOf('.js') && file.indexOf('index.js') < 0) {
            let name = file.split('.')[0]
            let data = require('./' + file)
            if (data.forEach) {
                data.forEach(item => {
                    item = setDefaults(item, name)
                    definitions[item.name] = item.definition
                })
            } else {
                let item = data
                item = setDefaults(item, name)
                definitions[item.name] = item.definition
            }
        }
    })
})()

module.exports = definitions
