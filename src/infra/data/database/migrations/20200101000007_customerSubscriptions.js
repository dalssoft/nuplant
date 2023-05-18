
exports.up = async function (knex) {
    knex.schema.hasTable('customer_subscriptions')
        .then(function (exists) {
            if (exists) return
            return knex.schema
                .createTable('customer_subscriptions', function (table) {
                    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
                    table.datetime('created_at').notNullable().defaultTo(knex.fn.now())
                    table.uuid('customer_id').references('id').inTable('customers')
                    table.uuid('subscription_plan_id').references('id').inTable('subscription_plans')
                    table.timestamp('start_date')
                    table.timestamp('end_date')
                    table.boolean('active')
                })
        })
}

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('customer_subscriptions')
}
