const env = require('sugar-env')
require('dotenv').config()

module.exports = {
    port: env.get('API_PORT', 3000),
    host: env.get('API_HOST', '0.0.0.0'),
    graphql: { 
        rootPath: env.get('GRAPHQL_ROOT_PATH', '/graphql')
    }, 
    auth: {
        jwtSecret: env.get('JWT_SECRET'),
    }
}
