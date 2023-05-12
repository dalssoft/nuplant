const { usecase, step, Ok, Err, request } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const Customer = require('../../entities/customer')
const CustomerRepository = require('../../../infra/data/repositories/customerRepository')

const dependency = { CustomerRepository }

const createCustomer = injection =>
    usecase('Create Customer', {
        // Input/Request metadata and validation
        request: request.from(Customer, { ignoreIDs: true }),

        // Output/Response metadata
        response: Customer,

        // Authorization with Audit
        // authorize: (user) => (user.canCreateCustomer ? Ok() : Err()),
        authorize: () => Ok(),

        setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

        // Step description and function
        'Check if the Customer is valid': step(ctx => {
            ctx.customer = Customer.fromJSON(ctx.req)

            if (!ctx.customer.isValid({ exceptIDs: true })) {
                return Err.invalidEntity({
                    message: 'The Customer entity is invalid',
                    payload: { entity: 'Customer' },
                    cause: ctx.customer.errors
                })
            }

            // returning Ok continues to the next step. Err stops the use case execution.
            return Ok()
        }),

        'Save the Customer': step(async ctx => {
            const repo = new ctx.di.CustomerRepository(injection)
            const customer = ctx.customer
            // ctx.ret is the return value of a use case
            return (ctx.ret = await repo.insert(customer))
        })
    })

module.exports =
    herbarium.usecases
        .add(createCustomer, 'CreateCustomer')
        .metadata({ group: 'Customer', operation: herbarium.crud.create, entity: Customer })
        .usecase
