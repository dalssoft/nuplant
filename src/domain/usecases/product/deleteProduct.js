const { usecase, step, Ok, Err } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const Product = require('../../entities/product')
const ProductRepository = require('../../../infra/data/repositories/productRepository')

const dependency = { ProductRepository }

const deleteProduct = injection =>
    usecase('Delete Product', {
        // Input/Request metadata and validation
        request: {
            id: String
        },

        // Output/Response metadata
        response: Boolean,

        // Authorization with Audit
        authorize: (user) => (user.can('DeleteProduct') ? Ok() : Err()),

        setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

        'Check if the Product exist': step(async ctx => {
            const repo = new ctx.di.ProductRepository(injection)
            const [product] = await repo.findByID(ctx.req.id)
            ctx.product = product

            if (product) return Ok()
            return Err.notFound({
                message: `Product ID ${ctx.req.id} does not exist`,
                payload: { entity: 'Product' }
            })
        }),

        'Delete the Product': step(async ctx => {
            const repo = new ctx.di.ProductRepository(injection)
            ctx.ret = await repo.delete(ctx.product)
            // ctx.ret is the return value of a use case
            return Ok(ctx.ret)
        })
    })

module.exports =
        herbarium.nodes
            .add('DeleteProduct', deleteProduct, herbarium.node.usecase)
            .metadata({ operation: herbarium.crud.delete })
            .link('Product')
            .value