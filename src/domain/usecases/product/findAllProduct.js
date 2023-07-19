const { usecase, step, Ok, Err } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const Product = require('../../entities/product')
const ProductRepository = require('../../../infra/data/repositories/productRepository')

const dependency = { ProductRepository }

const findAllProduct = injection =>
    usecase('Find all Products', {
    // Input/Request metadata and validation
        request: {
            limit: Number,
            offset: Number
        },

        // Output/Response metadata
        response: [Product],

        // Authorization with Audit
        authorize: (user) => (user.can('FindAllProduct') ? Ok() : Err()),

        setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

        'Find and return all the Products': step(async ctx => {
            const repo = new ctx.di.ProductRepository(injection)
            const products = await repo.findAll(ctx.req)
            // ctx.ret is the return value of a use case
            return Ok(ctx.ret = products)
        })
    })

module.exports =
  herbarium.usecases
      .add(findAllProduct, 'FindAllProduct')
      .metadata({ group: 'Product', operation: herbarium.crud.readAll, entity: Product })
      .usecase
