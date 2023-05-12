const crypto = require('crypto');

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('products').del()
  await knex('products').insert([
    { id: '27d2d6fc-0a26-496a-b97b-e48dad2ea25f', name: 'Product 1', description: 'Description 1' },
    { id: '670bc993-8927-45cc-bfda-0d705bfd78db', name: 'Product 2', description: 'Description 2' },
    { id: crypto.randomUUID(), name: 'Product 3', description: 'Description 3' },
    { id: crypto.randomUUID(), name: 'Product 4', description: 'Description 4' },
  ])
}
