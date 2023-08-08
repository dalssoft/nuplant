const { Repository } = require('@herbsjs/herbs2knex')
const { herbarium } = require('@herbsjs/herbarium')
const Customer = require('../../../domain/entities/customer')
const connection = require('../database/connection')

class CustomerRepository extends Repository {
    constructor (injection) {
        super({
            entity: Customer,
            table: 'customers',
            knex: connection
        })
    }
}

module.exports =
    herbarium.nodes
        .add('CustomerRepository', CustomerRepository, herbarium.node.repository)
        .link('Customer')
        .value
