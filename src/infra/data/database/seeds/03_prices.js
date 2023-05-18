const crypto = require('crypto')

exports.seed = async function (knex) {
    // Deletes ALL existing entries
    await knex('prices').del()
    await knex('prices').insert([
        { id: '4ad0ffc7-5827-41fb-b6b5-ddce9a6f6e1f', product_id: '27d2d6fc-0a26-496a-b97b-e48dad2ea25f', price: 10.00 },
        { id: crypto.randomUUID(), product_id: '27d2d6fc-0a26-496a-b97b-e48dad2ea25f', price: 20.00 },
        { id: crypto.randomUUID(), product_id: '27d2d6fc-0a26-496a-b97b-e48dad2ea25f', price: 30.00 },
        { id: '27d2d6fc-0a26-496a-b97b-e48dad2ea25f', product_id: '670bc993-8927-45cc-bfda-0d705bfd78db', price: 12.00 },
        { id: crypto.randomUUID(), product_id: '670bc993-8927-45cc-bfda-0d705bfd78db', price: 22.00 },
        { id: crypto.randomUUID(), product_id: '670bc993-8927-45cc-bfda-0d705bfd78db', price: 32.00 }
    ])
}
