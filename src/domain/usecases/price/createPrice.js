const { usecase, step, Ok, Err, request } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const Price = require('../../entities/price')
const PriceRepository = require('../../../infra/data/repositories/priceRepository')

const dependency = { PriceRepository }

const createPrice = injection =>
    usecase('Create Price', {
        // Input/Request metadata and validation
        request: request.from(Price, { ignoreIDs: true }),

        // Output/Response metadata
        response: Price,

        // Authorization with Audit
        authorize: (user) => (user.can('CreatePrice') ? Ok() : Err()),

        setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

        'Check if the Price is valid': step(ctx => {
            ctx.price = Price.fromJSON(ctx.req)

            if (!ctx.price.isValid({ exceptIDs: true, references: { onlyIDs: true } })) {
                return Err.invalidEntity({
                    message: 'The Price entity is invalid',
                    payload: { entity: 'Price' },
                    cause: ctx.price.errors
                })
            }

            return Ok()
        }),

        'Save the Price': step(async ctx => {
            const repo = new ctx.di.PriceRepository(injection)
            const price = ctx.price
            price.productId = price.product.id
            const newPrice = await repo.insert(price)
            newPrice.product = price.product
            return (ctx.ret = newPrice)
        })
    })

module.exports =
    herbarium.nodes
        .add('CreatePrice', createPrice, herbarium.node.usecase)
        .metadata({ operation: herbarium.crud.create })
        .link('Price')
        .value