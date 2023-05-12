require('dotenv').config()

module.exports = {
    herbsCLI: 'postgres',
    client: 'pg',
    connection: {
        host: '0.0.0.0',
        user: 'postgres',
        password: 'postgres',
        database: 'nuplant'
    }
}
