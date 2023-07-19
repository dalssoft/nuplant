
exports.up = async function (knex) {
    knex.schema.hasTable('users')
        .then(function (exists) {
            if (exists) return
            return knex.schema
                .createTable('users', function (table) {
                    table.string('id').primary()
                    table.specificType('permissions', 'text[]').notNullable()
                    table.timestamps()
                })
        })
}

exports.down = function (knex) {
    return knex.schema
    .dropTableIfExists('users')
}
