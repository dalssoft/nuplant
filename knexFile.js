module.exports = {
    development: {
        client: 'postgresql',
        connection: {
            database: 'nuplant',
            user: 'postgres',
            password: 'postgres',
            host: '0.0.0.0',
            port: 5432
        },
        migrations: {
            directory: './src/infra/data/database/migrations',
            tableName: 'knex_migrations'
        },
        seeds: {
            directory: './src/infra/data/database/seeds'
        }
    },
    staging: {},
    production: {}
}
