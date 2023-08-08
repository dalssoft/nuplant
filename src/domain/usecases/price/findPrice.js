const { usecase, step, Ok, Err } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const Price = require('../../entities/price')
const Product = require('../../entities/product')
const PriceRepository = require('../../../infra/data/repositories/priceRepository')

const dependency = { PriceRepository }

const findPrice = injection =>
    usecase('Find a Price', {
        // Input/Request metadata and validation
        request: {
            id: String
        },

        // Output/Response metadata
        response: Price,

        // Authorization with Audit
        authorize: (user) => (user.can('FindPrice') ? Ok() : Err()),

        setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

        'Find and return the Price': step(async ctx => {
            const id = ctx.req.id
            const repo = new ctx.di.PriceRepository(injection)
            const [price] = await repo.findByID(id)
            if (!price) {
                return Err.notFound({
                    message: `Price entity not found by ID: ${id}`,
                    payload: { entity: 'Price', id }
                })
            }
            price.product = Product.fromJSON({ id: price.productId })
            return Ok(ctx.ret = price)
        })
    })

module.exports =
    herbarium.nodes
        .add('FindPrice', findPrice, herbarium.node.usecase)
        .metadata({ operation: herbarium.crud.read })
        .link('Price')
        .value