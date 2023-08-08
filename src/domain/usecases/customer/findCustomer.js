const { usecase, step, Ok, Err } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const Customer = require('../../entities/customer')
const CustomerRepository = require('../../../infra/data/repositories/customerRepository')

const dependency = { CustomerRepository }

const findCustomer = injection =>
    usecase('Find a Customer', {
        // Input/Request metadata and validation
        request: {
            id: String
        },

        // Output/Response metadata
        response: Customer,

        // Authorization with Audit
        authorize: (user) => (user.can('FindCustomer') ? Ok() : Err()),

        setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

        'Find and return the Customer': step(async ctx => {
            const id = ctx.req.id
            const repo = new ctx.di.CustomerRepository(injection)
            const [customer] = await repo.findByID(id)
            if (!customer) {
                return Err.notFound({
                    message: `Customer entity not found by ID: ${id}`,
                    payload: { entity: 'Customer', id }
                })
            }
            // ctx.ret is the return value of a use case
            return Ok(ctx.ret = customer)
        })
    })

module.exports =
    herbarium.nodes
        .add('FindCustomer', findCustomer, herbarium.node.usecase)
        .link('Customer')
        .metadata({ operation: herbarium.crud.read })
        .value
