
exports.up = async function (knex) {
    knex.schema.hasTable('users')
        .then(function (exists) {
            if (exists) return
            return knex.schema
                .createTable('users', function (table) {
                    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"))
                    table.datetime('created_at').notNullable().defaultTo(knex.fn.now())
                    table.string('nickname')
                    table.integer('registration_number')
                    table.string('password')
                })
        })
}

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('users')
}
