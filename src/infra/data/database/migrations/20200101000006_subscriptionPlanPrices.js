
exports.up = async function (knex) {
    knex.schema.hasTable('subscription_plan_prices')
        .then(function (exists) {
            if (exists) return
            return knex.schema
                .createTable('subscription_plan_prices', function (table) {
                    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
                    table.datetime('created_at').notNullable().defaultTo(knex.fn.now())
                    table.uuid('subscription_plan_id').references('id').inTable('subscription_plans')
                    table.uuid('price_id').references('id').inTable('prices')
                })
        })
}

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('subscription_plan_prices')
}
