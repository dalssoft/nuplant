
// exports.up = async function (knex) {
//     knex.schema.hasTable('subscription_plans')
//         .then(function (exists) {
//             if (exists) return
//             return knex.schema
//                 .createTable('subscription_plans', function (table) {
//                     table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"))
//                     table.datetime('created_at').notNullable().defaultTo(knex.fn.now())
//                     table.string('name')
//                     table.string('description')
//                     table.string('billing_frequency')
//                 })
//         })
// }

// exports.down = function (knex) {
//     return knex.schema
//         .dropTableIfExists('subscription_plans')
// }

const crypto = require('crypto')

exports.seed = async function (knex) {
    // Deletes ALL existing entries
    await knex('subscription_plans').del()
    await knex('subscription_plans').insert([
        { id: 'aeb2eb4a-f38a-4ef3-b110-a142b8fc6774', name: 'Free', description: 'Free subscription plan', billing_frequency: 'm' },
        { id: 'a0199263-9524-429f-9537-a0cf4e206991', name: 'Basic', description: 'Basic subscription plan', billing_frequency: 'm' },
        { id: 'e66c362f-55e1-42da-8db6-4c0fadcac0d4', name: 'Premium', description: 'Premium subscription plan', billing_frequency: 'm' },
        { id: crypto.randomUUID(), name: 'Enterprise', description: 'Enterprise subscription plan', billing_frequency: 'm' }
    ])
}
