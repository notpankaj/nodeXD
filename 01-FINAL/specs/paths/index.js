'use strict'
const fs = require('fs')
const changeCaseObject = require('change-case-object')

const paths = {}

const setActionDefaults = (action, options) => {
    action.consumes = action.consumes || [
        'application/json'
    ]

    action.produces = action.produces || [
        'application/json'
    ]

    let summary = ''
    let description = ''
    let operationId = ''

    switch (options.type) {
        case 'post':
            summary = `create`
            description = `creates new item in ${options.name}`
            operationId = 'create'
            break

        case 'put':
            summary = `update`
            description = `updates an item in ${options.name}`
            operationId = 'update'
            break

        case 'delete':
            summary = `remove`
            description = `removes an item in ${options.name}`
            operationId = 'delete'
            break

        case 'get':
            if (!options.url || options.url === '' || options.url === '/') {
                summary = `search`
                description = `searches in ${options.name}`
                operationId = 'search'
            } else if (options.url === '/{id}') {
                summary = `get`
                description = `gets an item by id in ${options.name}`
                operationId = 'get-by-id'
            } else if (options.url === '/{code}') {
                summary = `get`
                description = `gets an item by code in ${options.name}`
                operationId = 'get-by-code'
            } else {
                summary = `get`
                description = `gets an item in ${options.name}`
                operationId = 'get'
            }
            break
    }

    action.summary = action.summary || summary
    action.description = action.description || description
    action.operationId = action.operationId || operationId

    if (!action.tags) {
        action.tags = [options.name]
    }

    if (action.parameters) {
        action.parameters.forEach(param => {

            switch (options.type) {
                case 'post':
                    param.in = param.in || 'body'
                    break

                case 'put':
                    param.in = param.in || 'body'
                    break
            }
        })
    }

    return action
}

const setDefaults = (data, fileName) => {
    let item = {
        url: null,
        actions: {}
    }

    let name = changeCaseObject.camelCase(fileName)

    if (!data.url || data.url === '' || data.url === '/') {
        item.url = `/${name}`
    } else {
        item.url = `/${name}${data.url}`
    }

    if (data.post) {
        item.actions.post = setActionDefaults(data.post, { type: 'post', name: name, url: data.url })
    }

    if (data.put) {
        item.actions.put = setActionDefaults(data.put, { type: 'put', name: name, url: data.url })
    }

    if (data.get) {
        item.actions.get = setActionDefaults(data.get, { type: 'get', name: name, url: data.url })
    }

    if (data.delete) {
        item.actions.delete = setActionDefaults(data.delete, { type: 'delete', name: name, url: data.url })
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
                    let path = setDefaults(item, name)
                    paths[path.url] = path.actions
                })
            } else {
                let path = setDefaults(data, name)
                paths[path.url] = path.actions
            }
        }
    })
})()

module.exports = paths
