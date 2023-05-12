
exports.up = async function (knex) {
    knex.schema.hasTable('prices')
        .then(function (exists) {
            if (exists) return
            return knex.schema
                .createTable('prices', function (table) {
                    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"))
                    table.datetime('created_at').notNullable().defaultTo(knex.fn.now())
                    table.uuid('product_id').references('id').inTable('products').notNullable()
                    table.decimal('price')
                })
        })
}

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('prices')
}
