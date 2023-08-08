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
            offset: Number,
            ids: [String],
        },

        // Output/Response metadata
        response: [Price],

        // Authorization with Audit
        authorize: (user) => (user.can('FindAllPrice') ? Ok() : Err()),

        setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

        'Find and return all the Prices': step(async ctx => {
            const repo = new ctx.di.PriceRepository(injection)
            const { limit, offset, ids } = ctx.req
            const prices = await repo.find({ limit, offset, where: { id: ids } })
            prices.forEach(price => (price.product = Product.fromJSON({ id: price.productId })))
            return Ok(ctx.ret = prices)
        })
    })

module.exports =
        herbarium.nodes
            .add('FindAllPrice', findAllPrice, herbarium.node.usecase)
            .link('Price')
            .metadata({ operation: herbarium.crud.readAll })
            .value
