const { usecase, step, Ok, Err, request } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const merge = require('deepmerge')
const Customer = require('../../entities/customer')
const CustomerRepository = require('../../../infra/data/repositories/customerRepository')

const dependency = { CustomerRepository }

const updateCustomer = injection =>
    usecase('Update Customer', {
    // Input/Request metadata and validation
        request: request.from(Customer),

        // Output/Response metadata
        response: Customer,

        // Authorization with Audit
        // authorize: (user) => (user.canUpdateCustomer ? Ok() : Err()),
        authorize: () => Ok(),

        setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

        'Retrieve the Customer': step(async ctx => {
            const id = ctx.req.id
            const repo = new ctx.di.CustomerRepository(injection)
            const [customer] = await repo.findByID(id)
            ctx.customer = customer
            if (customer === undefined) {
                return Err.notFound({
                    message: `Customer not found - ID: ${id}`,
                    payload: { entity: 'Customer' }
                })
            }

            return Ok(customer)
        }),

        'Check if it is a valid Customer before update': step(ctx => {
            const oldCustomer = ctx.customer
            const newCustomer = Customer.fromJSON(merge.all([oldCustomer, ctx.req]))
            ctx.customer = newCustomer

            return newCustomer.isValid()
                ? Ok()
                : Err.invalidEntity({
                    message: 'Customer is invalid',
                    payload: { entity: 'Customer' },
                    cause: newCustomer.errors
                })
        }),

        'Update the Customer': step(async ctx => {
            const repo = new ctx.di.CustomerRepository(injection)
            // ctx.ret is the return value of a use case
            return (ctx.ret = await repo.update(ctx.customer))
        })

    })

module.exports =
  herbarium.usecases
      .add(updateCustomer, 'UpdateCustomer')
      .metadata({ group: 'Customer', operation: herbarium.crud.update, entity: Customer })
      .usecase
