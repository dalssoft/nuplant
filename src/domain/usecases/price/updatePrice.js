const { usecase, step, Ok, Err, request } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const merge = require('deepmerge')
const Price = require('../../entities/price')
const PriceRepository = require('../../../infra/data/repositories/priceRepository')
const Product = require('../../entities/product')

const dependency = { PriceRepository }

const updatePrice = injection =>
    usecase('Update Price', {
        // Input/Request metadata and validation
        request: request.from(Price),

        // Output/Response metadata
        response: Price,

        // Authorization with Audit
        authorize: (user) => (user.can('UpdatePrice') ? Ok() : Err()),

        setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

        'Retrieve the Price': step(async ctx => {
            const id = ctx.req.id
            const repo = new ctx.di.PriceRepository(injection)
            const [price] = await repo.findByID(id)
            ctx.price = price
            if (price === undefined) {
                return Err.notFound({
                    message: `Price not found - ID: ${id}`,
                    payload: { entity: 'Price' }
                })
            }

            return Ok(price)
        }),

        'Check if it is a valid Price before update': step(ctx => {
            const oldPrice = ctx.price
            const newPrice = Price.fromJSON(merge.all([oldPrice, ctx.req]))
            ctx.price = newPrice

            return newPrice.isValid({ references: { onlyIDs: true } })
                ? Ok()
                : Err.invalidEntity({
                    message: 'Price is invalid',
                    payload: { entity: 'Price' },
                    cause: newPrice.errors
                })
        }),

        'Update the Price': step(async ctx => {
            const repo = new ctx.di.PriceRepository(injection)
            const price = ctx.price
            ctx.price.productId = ctx.price.product.id
            const updated = await repo.update(price)
            updated.product = Product.fromJSON({ id: updated.productId })
            return (ctx.ret = updated)
        })

    })

module.exports =
        herbarium.nodes
            .add('UpdatePrice', updatePrice, herbarium.node.usecase)
            .metadata({ operation: herbarium.crud.update })
            .link('Price')
            .value