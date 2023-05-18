
exports.up = async function (knex) {
    knex.schema.hasTable('products')
        .then(function (exists) {
            if (exists) return
            return knex.schema
                .createTable('products', function (table) {
                    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
                    table.datetime('created_at').notNullable().defaultTo(knex.fn.now())
                    table.string('name')
                    table.string('description')
                })
        })
}

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('products')
}
