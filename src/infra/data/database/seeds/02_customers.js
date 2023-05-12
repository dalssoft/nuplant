const crypto = require('crypto');

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('customers').del()
  await knex('customers').insert([
    { id: '27d2d6fc-0a26-496a-b97b-e48dad2ea25f', name: 'Customer 1', email: 'customer1@email.com', billing_address: 'Street 1'},
    { id: crypto.randomUUID(), name: 'Customer 2', email: 'customer2@email.com', billing_address: 'Street 2'},
    { id: crypto.randomUUID(), name: 'Customer 3', email: 'customer3@email.com', billing_address: 'Street 3'},
  ])
}
