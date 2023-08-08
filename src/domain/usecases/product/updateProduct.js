const { usecase, step, Ok, Err, request } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const merge = require('deepmerge')
const Product = require('../../entities/product')
const ProductRepository = require('../../../infra/data/repositories/productRepository')

const dependency = { ProductRepository }

const updateProduct = injection =>
    usecase('Update Product', {
        // Input/Request metadata and validation
        request: request.from(Product),

        // Output/Response metadata
        response: Product,

        // Authorization with Audit
        authorize: (user) => (user.can('UpdateProduct') ? Ok() : Err()),

        setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

        'Retrieve the Product': step(async ctx => {
            const id = ctx.req.id
            const repo = new ctx.di.ProductRepository(injection)
            const [product] = await repo.findByID(id)
            ctx.product = product
            if (product === undefined) {
                return Err.notFound({
                    message: `Product not found - ID: ${id}`,
                    payload: { entity: 'Product' }
                })
            }

            return Ok(product)
        }),

        'Check if it is a valid Product before update': step(ctx => {
            const oldProduct = ctx.product
            const newProduct = Product.fromJSON(merge.all([oldProduct, ctx.req]))
            ctx.product = newProduct

            return newProduct.isValid()
                ? Ok()
                : Err.invalidEntity({
                    message: 'Product is invalid',
                    payload: { entity: 'Product' },
                    cause: newProduct.errors
                })
        }),

        'Update the Product': step(async ctx => {
            const repo = new ctx.di.ProductRepository(injection)
            // ctx.ret is the return value of a use case
            return (ctx.ret = await repo.update(ctx.product))
        })

    })

module.exports =
        herbarium.nodes
            .add('UpdateProduct', updateProduct, herbarium.node.usecase)
            .metadata({ operation: herbarium.crud.update })
            .link('Product')
            .value