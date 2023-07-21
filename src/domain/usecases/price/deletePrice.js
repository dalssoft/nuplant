const { usecase, step, Ok, Err } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const Price = require('../../entities/price')
const PriceRepository = require('../../../infra/data/repositories/priceRepository')

const dependency = { PriceRepository }

const deletePrice = injection =>
    usecase('Delete Price', {
        // Input/Request metadata and validation
        request: {
            id: String
        },

        // Output/Response metadata
        response: Boolean,

        // Authorization with Audit
        authorize: (user) => (user.can('DeletePrice') ? Ok() : Err()),

        setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

        'Check if the Price exist': step(async ctx => {
            const repo = new ctx.di.PriceRepository(injection)
            const [price] = await repo.findByID(ctx.req.id)
            ctx.price = price

            if (price) return Ok()
            return Err.notFound({
                message: `Price ID ${ctx.req.id} does not exist`,
                payload: { entity: 'Price' }
            })
        }),

        'Delete the Price': step(async ctx => {
            const repo = new ctx.di.PriceRepository(injection)
            ctx.ret = await repo.delete(ctx.price)
            // ctx.ret is the return value of a use case
            return Ok(ctx.ret)
        })
    })

module.exports =
    herbarium.usecases
        .add(deletePrice, 'DeletePrice')
        .metadata({ group: 'Price', operation: herbarium.crud.delete, entity: Price })
        .usecase
