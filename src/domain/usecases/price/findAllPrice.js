const { usecase, step, Ok } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const Price = require('../../entities/price')
const PriceRepository = require('../../../infra/data/repositories/priceRepository')
const Product = require('../../entities/product')

const dependency = { PriceRepository }

const findAllPrice = injection =>
    usecase('Find all Prices', {
        // Input/Request metadata and validation
        request: {
            limit: Number,
            offset: Number
        },

        // Output/Response metadata
        response: [Price],

        // Authorization with Audit
        authorize: () => Ok(),

        setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

        'Find and return all the Prices': step(async ctx => {
            const repo = new ctx.di.PriceRepository(injection)
            const prices = await repo.findAll(ctx.req)
            prices.forEach(price => price.product = Product.fromJSON({ id: price.productId }))
            return Ok(ctx.ret = prices)
        })
    })

module.exports =
    herbarium.usecases
        .add(findAllPrice, 'FindAllPrice')
        .metadata({ group: 'Price', operation: herbarium.crud.readAll, entity: Price })
        .usecase
