const { usecase, step, Ok } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const Customer = require('../../entities/customer')
const CustomerRepository = require('../../../infra/data/repositories/customerRepository')

const dependency = { CustomerRepository }

const findAllCustomer = injection =>
    usecase('Find all Customers', {
    // Input/Request metadata and validation
        request: {
            limit: Number,
            offset: Number
        },

        // Output/Response metadata
        response: [Customer],

        // Authorization with Audit
        authorize: () => Ok(),

        setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

        'Find and return all the Customers': step(async ctx => {
            const repo = new ctx.di.CustomerRepository(injection)
            const customers = await repo.findAll(ctx.req)
            // ctx.ret is the return value of a use case
            return Ok(ctx.ret = customers)
        })
    })

module.exports =
  herbarium.usecases
      .add(findAllCustomer, 'FindAllCustomer')
      .metadata({ group: 'Customer', operation: herbarium.crud.readAll, entity: Customer })
      .usecase
