
exports.up = async function (knex) {
    knex.schema.hasTable('customers')
        .then(function (exists) {
            if (exists) return
            return knex.schema
                .createTable('customers', function (table) {
                    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"))
                    table.datetime('created_at').notNullable().defaultTo(knex.fn.now())
                    table.string('name')
                    table.string('email')
                    table.string('billing_address')
                })
        })
}

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('customers')
}
