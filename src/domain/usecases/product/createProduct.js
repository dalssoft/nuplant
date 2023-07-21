const { usecase, step, Ok, Err, request } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const Product = require('../../entities/product')
const ProductRepository = require('../../../infra/data/repositories/productRepository')

const dependency = { ProductRepository }

const createProduct = injection =>
    usecase('Create Product', {
        // Input/Request metadata and validation
        request: request.from(Product, { ignoreIDs: true }),

        // Output/Response metadata
        response: Product,

        // Authorization with Audit
        authorize: (user) => (user.can('CreateProduct') ? Ok() : Err()),

        setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

        // Step description and function
        'Check if the Product is valid': step(ctx => {
            ctx.product = Product.fromJSON(ctx.req)

            if (!ctx.product.isValid({ exceptIDs: true })) {
                return Err.invalidEntity({
                    message: 'The Product entity is invalid',
                    payload: { entity: 'Product' },
                    cause: ctx.product.errors
                })
            }

            // returning Ok continues to the next step. Err stops the use case execution.
            return Ok()
        }),

        'Save the Product': step(async ctx => {
            const repo = new ctx.di.ProductRepository(injection)
            const product = ctx.product
            // ctx.ret is the return value of a use case
            return (ctx.ret = await repo.insert(product))
        })
    })

module.exports =
    herbarium.usecases
        .add(createProduct, 'CreateProduct')
        .metadata({ group: 'Product', operation: herbarium.crud.create, entity: Product })
        .usecase
