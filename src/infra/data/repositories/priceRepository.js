const { Repository } = require('@herbsjs/herbs2knex')
const { herbarium } = require('@herbsjs/herbarium')
const Price = require('../../../domain/entities/price')
const connection = require('../database/connection')

class PriceRepository extends Repository {
    constructor (injection) {
        super({
            entity: Price,
            table: 'prices',
            knex: connection,
            foreignKeys: [{ productId: String }]
        })
    }
}

module.exports =
    herbarium.repositories
        .add(PriceRepository, 'PriceRepository')
        .metadata({ entity: Price })
        .repository
