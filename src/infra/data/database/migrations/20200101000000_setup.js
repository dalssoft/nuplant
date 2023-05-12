
exports.up = async function (knex) {
    await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
}

exports.down = function (knex) {
    return knex.raw('DROP EXTENSION IF EXISTS "uuid-ossp";')
}
