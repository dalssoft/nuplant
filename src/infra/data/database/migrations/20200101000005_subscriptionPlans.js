
exports.up = async function (knex) {
    knex.schema.hasTable('subscription_plans')
        .then(function (exists) {
            if (exists) return
            return knex.schema
                .createTable('subscription_plans', function (table) {
                    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
                    table.datetime('created_at').notNullable().defaultTo(knex.fn.now())
                    table.string('name')
                    table.string('description')
                    table.string('billing_frequency'),
                    table.boolean('active')
                })
        })
}

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('subscription_plans')
}
