const { usecase, step, Ok, Err } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const Customer = require('../../entities/customer')
const CustomerRepository = require('../../../infra/data/repositories/customerRepository')

const dependency = { CustomerRepository }

const deleteCustomer = injection =>
    usecase('Delete Customer', {
        // Input/Request metadata and validation
        request: {
            id: String
        },

        // Output/Response metadata
        response: Boolean,

        // Authorization with Audit
        authorize: (user) => (user.can('DeleteCustomer') ? Ok() : Err()),

        setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

        'Check if the Customer exist': step(async ctx => {
            const repo = new ctx.di.CustomerRepository(injection)
            const [customer] = await repo.findByID(ctx.req.id)
            ctx.customer = customer

            if (customer) return Ok()
            return Err.notFound({
                message: `Customer ID ${ctx.req.id} does not exist`,
                payload: { entity: 'Customer' }
            })
        }),

        'Delete the Customer': step(async ctx => {
            const repo = new ctx.di.CustomerRepository(injection)
            ctx.ret = await repo.delete(ctx.customer)
            // ctx.ret is the return value of a use case
            return Ok(ctx.ret)
        })
    })

module.exports =
    herbarium.nodes
        .add('DeleteCustomer', deleteCustomer, herbarium.node.usecase)
        .link('Customer')
        .metadata({ operation: herbarium.crud.delete })
        .value