const { usecase, step, Ok, Err } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const Product = require('../../entities/product')
const ProductRepository = require('../../../infra/data/repositories/productRepository')

const dependency = { ProductRepository }

const findProduct = injection =>
    usecase('Find a Product', {
    // Input/Request metadata and validation
        request: {
            id: String
        },

        // Output/Response metadata
        response: Product,

        // Authorization with Audit
        // authorize: (user) => (user.canFindOneProduct ? Ok() : Err()),
        authorize: () => Ok(),

        setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

        'Find and return the Product': step(async ctx => {
            const id = ctx.req.id
            const repo = new ctx.di.ProductRepository(injection)
            const [product] = await repo.findByID(id)
            if (!product) {
                return Err.notFound({
                    message: `Product entity not found by ID: ${id}`,
                    payload: { entity: 'Product', id }
                })
            }
            // ctx.ret is the return value of a use case
            return Ok(ctx.ret = product)
        })
    })

module.exports =
  herbarium.usecases
      .add(findProduct, 'FindProduct')
      .metadata({ group: 'Product', operation: herbarium.crud.read, entity: Product })
      .usecase
