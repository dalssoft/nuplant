const { Repository } = require('@herbsjs/herbs2knex')
const { herbarium } = require('@herbsjs/herbarium')
const Product = require('../../../domain/entities/product')
const connection = require('../database/connection')

class ProductRepository extends Repository {
    constructor(injection) {
        super({
            entity: Product,
            table: 'products',
            knex: connection
        })
    }
}

module.exports =
    herbarium.nodes
        .add('ProductRepository', ProductRepository, herbarium.node.repository)
        .link('Product')
        .value