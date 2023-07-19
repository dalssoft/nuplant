const server = require('./infra/api/server')
const config = require('./infra/config')
const { name, description, version } = require('../package.json')

// eslint-disable-next-line no-console
console.info(`\n\x1b[1m${name} - ${description}\x1b[90m v${version}\x1b[0m\n`)

server.start(config)
