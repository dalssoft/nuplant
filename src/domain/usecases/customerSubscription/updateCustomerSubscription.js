const { usecase, step, Ok, Err, request } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const merge = require('deepmerge')
const CustomerSubscription = require('../../entities/customerSubscription')
const CustomerSubscriptionRepository = require('../../../infra/data/repositories/customerSubscriptionRepository')

const dependency = { CustomerSubscriptionRepository }

const updateCustomerSubscription = injection =>
    usecase('Update Customer Subscription', {
    // Input/Request metadata and validation
        request: request.from(CustomerSubscription),

        // Output/Response metadata
        response: CustomerSubscription,

        // Authorization with Audit
        // authorize: (user) => (user.canUpdateCustomerSubscription ? Ok() : Err()),
        authorize: () => Ok(),

        setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

        'Retrieve the Customer Subscription': step(async ctx => {
            const id = ctx.req.id
            const repo = new ctx.di.CustomerSubscriptionRepository(injection)
            const [customerSubscription] = await repo.findByID(id)
            ctx.customerSubscription = customerSubscription
            if (customerSubscription === undefined) {
                return Err.notFound({
                    message: `CustomerSubscription not found - ID: ${id}`,
                    payload: { entity: 'Customer Subscription' }
                })
            }

            return Ok(customerSubscription)
        }),

        'Check if it is a valid Customer Subscription before update': step(ctx => {
            const oldCustomerSubscription = ctx.customerSubscription
            const newCustomerSubscription = CustomerSubscription.fromJSON(merge.all([oldCustomerSubscription, ctx.req]))
            ctx.customerSubscription = newCustomerSubscription

            return newCustomerSubscription.isValid()
                ? Ok()
                : Err.invalidEntity({
                    message: 'CustomerSubscription is invalid',
                    payload: { entity: 'Customer Subscription' },
                    cause: newCustomerSubscription.errors
                })
        }),

        'Update the CustomerSubscription': step(async ctx => {
            const repo = new ctx.di.CustomerSubscriptionRepository(injection)
            // ctx.ret is the return value of a use case
            return (ctx.ret = await repo.update(ctx.customerSubscription))
        })

    })

module.exports =
  herbarium.usecases
      .add(updateCustomerSubscription, 'UpdateCustomerSubscription')
      .metadata({ group: 'CustomerSubscription', operation: herbarium.crud.update, entity: CustomerSubscription })
      .usecase
