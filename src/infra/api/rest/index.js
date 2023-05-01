const express = require('express')
const cors = require('cors')
const { json } = require('body-parser')
const { populateMetadata, generateEndpoints } = require('@herbsjs/herbs2rest')
const { herbarium } = require('@herbsjs/herbarium')
const controller = require('./controller')

async function rest(app, config) {

    // Request security
    app.use(json({ limit: '50mb' }))
    app.use(cors())

    const server = new express.Router()

    herbs2rest({ server, config })

    app.use(server)
}

async function herbs2rest({ server, config }) {

    // Herbs2REST will populate the Express endpoints 
    // based on your use cases and entities.

    // 1. Prepare your use cases metadata if needed
    // Ex: herbarium.usecases.get('SearchUser').metadata({ REST: [{ method: 'GET' }] })

    // 2. Populate the metadata
    // Each use case will be populated with the metadata:
    // version, resource, method, path, parameters, parametersHandler, controller
    populateMetadata({ herbarium, controller, version: 'v1' })

    // 3. Generate the endpoints based on the metadata
    generateEndpoints({ herbarium, server })

}

module.exports = { rest }