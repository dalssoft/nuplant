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
    herbarium.repositories
        .add(CustomerRepository, 'CustomerRepository')
        .metadata({ entity: Customer })
        .repository
