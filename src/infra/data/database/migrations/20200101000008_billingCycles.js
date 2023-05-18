
exports.up = async function (knex) {
    knex.schema.hasTable('billing_cycles')
        .then(function (exists) {
            if (exists) return
            return knex.schema
                .createTable('billing_cycles', function (table) {
                    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
                    table.datetime('created_at').notNullable().defaultTo(knex.fn.now())
                    table.uuid('customer_subscription_id').references('id').inTable('customer_subscriptions')
                    table.timestamp('start_date')
                    table.timestamp('end_date')
                    table.integer('amount_due')
                    table.string('payment_status')
                    table.string('payment_processor_transaction_id')
                    table.timestamp('payment_date')
                })
        })
}

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists('billing_cycles')
}
