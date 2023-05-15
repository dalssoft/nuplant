const { usecase, step, Ok, Err } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const CustomerSubscription = require('../../entities/customerSubscription')
const CustomerSubscriptionRepository = require('../../../infra/data/repositories/customerSubscriptionRepository')

const dependency = { CustomerSubscriptionRepository }

const deleteCustomerSubscription = injection =>
    usecase('Delete Customer Subscription', {
    // Input/Request metadata and validation
        request: {
            id: String
        },

        // Output/Response metadata
        response: Boolean,

        // Authorization with Audit
        // authorize: (user) => (user.canDeleteCustomerSubscription ? Ok() : Err()),
        authorize: () => Ok(),

        setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

        'Check if the Customer Subscription exist': step(async ctx => {
            const repo = new ctx.di.CustomerSubscriptionRepository(injection)
            const [customerSubscription] = await repo.findByID(ctx.req.id)
            ctx.customerSubscription = customerSubscription

            if (customerSubscription) return Ok()
            return Err.notFound({
                message: `Customer Subscription ID ${ctx.req.id} does not exist`,
                payload: { entity: 'Customer Subscription' }
            })
        }),

        'Delete the Customer Subscription': step(async ctx => {
            const repo = new ctx.di.CustomerSubscriptionRepository(injection)
            ctx.ret = await repo.delete(ctx.customerSubscription)
            // ctx.ret is the return value of a use case
            return Ok(ctx.ret)
        })
    })

module.exports =
  herbarium.usecases
      .add(deleteCustomerSubscription, 'DeleteCustomerSubscription')
      .metadata({ group: 'CustomerSubscription', operation: herbarium.crud.delete, entity: CustomerSubscription })
      .usecase
