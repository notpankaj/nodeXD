'use strict'
const webServer = require('config').webServer

var about = require('../package.json')

const SPECS_URL = `${webServer.url}:${webServer.port}`

const spec = {
    swagger: '2.0',
    info: {
        version: about.version,
        title: about.name
    },
    host: SPECS_URL,
    basePath: '/api',
    schemes: [
        'http',
        // 'https'
    ],
    consumes: [
        'application/json',
        'multipart/form-data'
    ],
    produces: [
        'application/json'
    ],
    paths: {},
    definitions: {}
}

exports.get = () => {
    spec.definitions = require('./definitions')
    spec.paths = require('./paths')
    return spec
}