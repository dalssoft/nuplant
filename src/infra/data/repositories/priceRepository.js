const { Repository } = require('@herbsjs/herbs2knex')
const { herbarium } = require('@herbsjs/herbarium')
const Price = require('../../../domain/entities/price')
const connection = require('../database/connection')

class PriceRepository extends Repository {
    constructor(injection) {
        super({
            entity: Price,
            table: 'prices',
            knex: connection,
            foreignKeys: [{ productId: String }],
            fields: {
                product: {
                    map: { id: 'product_id' },
                    // single entity fetcher
                    // fetcher: (data) => productRepository.findByID(data.product_id),
                    // multiple entities fetcher (multiple products per price)
                    // fetcher: (data) => productRepository.find({ product_id: [data.product_id] }),
                }
            }
        })
    }
}

module.exports =
    herbarium.repositories
        .add(PriceRepository, 'PriceRepository')
        .metadata({ entity: Price })
        .repository
