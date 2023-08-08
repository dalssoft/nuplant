const express = require('express')
const { herbarium } = require('@herbsjs/herbarium')

const { sec } = require('./sec')
const { auth } = require('./auth')
const { graphql } = require('./graphql')
const { rest } = require('./rest')
const { shelf } = require('./shelf')

async function start (config) {
    herbarium.requireAll()

    const app = express()
    await sec(app, config)
    await auth(app, config)
    await rest(app, config)
    await graphql(app, config)
    await shelf(app, config)
    
    // save on disk herbarium graph
    // const graph = herbarium.nodes.toJSON()
    // const fs = require('fs')
    // fs.writeFileSync('./herbarium.json', JSON.stringify(graph))

    return app.listen(
        { port: config.api.port },
        // eslint-disable-next-line no-console
        () => console.log(`🚀 Server ready! \n\nhttp://localhost:${config.api.port}/\n`))
}

module.exports = { start }
