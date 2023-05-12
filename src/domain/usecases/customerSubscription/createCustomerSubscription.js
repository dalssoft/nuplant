const { usecase, step, Ok, Err, request } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const CustomerSubscription = require('../../entities/customerSubscription')
const CustomerSubscriptionRepository = require('../../../infra/data/repositories/customerSubscriptionRepository')

const dependency = { CustomerSubscriptionRepository }

const createCustomerSubscription = injection =>
    usecase('Create Customer Subscription', {
    // Input/Request metadata and validation
        request: request.from(CustomerSubscription, { ignoreIDs: true }),

        // Output/Response metadata
        response: CustomerSubscription,

        // Authorization with Audit
        // authorize: (user) => (user.canCreateCustomerSubscription ? Ok() : Err()),
        authorize: () => Ok(),

        setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

        // Step description and function
        'Check if the Customer Subscription is valid': step(ctx => {
            ctx.customerSubscription = CustomerSubscription.fromJSON(ctx.req)
            ctx.customerSubscription.id = Math.floor(Math.random() * 100000).toString()

            if (!ctx.customerSubscription.isValid()) {
                return Err.invalidEntity({
                    message: 'The Customer Subscription entity is invalid',
                    payload: { entity: 'Customer Subscription' },
                    cause: ctx.customerSubscription.errors
                })
            }

            // returning Ok continues to the next step. Err stops the use case execution.
            return Ok()
        }),

        'Save the Customer Subscription': step(async ctx => {
            const repo = new ctx.di.CustomerSubscriptionRepository(injection)
            const customerSubscription = ctx.customerSubscription
            // ctx.ret is the return value of a use case
            return (ctx.ret = await repo.insert(customerSubscription))
        })
    })

module.exports =
  herbarium.usecases
      .add(createCustomerSubscription, 'CreateCustomerSubscription')
      .metadata({ group: 'CustomerSubscription', operation: herbarium.crud.create, entity: CustomerSubscription })
      .usecase
