const { usecase, step, Ok, Err, request } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const Customer = require('../../entities/customer')
const CustomerSubscription = require('../../entities/customerSubscription')
const CustomerSubscriptionRepository = require('../../../infra/data/repositories/customerSubscriptionRepository')

const dependency = { CustomerSubscriptionRepository }

const cancelCustomerSubscription = injection =>
    usecase('Cancel Customer Subscription', {
        // Input/Request metadata and validation
        request: {
            id: String,
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
                message: `Customer Subscription does not exist for customer ${ctx.req.id}`,
                payload: { entity: 'Customer Subscription' }
            })
        }),

        'Cancel the Customer Subscription': step(async ctx => {
            const repo = new ctx.di.CustomerSubscriptionRepository(injection)
            const customerSubscription = ctx.customerSubscription
            customerSubscription.endDate = new Date()
            customerSubscription.active = false
            await repo.update(customerSubscription)
            return Ok(ctx.ret = true)
        })
    })

module.exports =
    herbarium.usecases
        .add(cancelCustomerSubscription, 'CancelCustomerSubscription')
        .metadata({ group: 'CustomerSubscription', entity: CustomerSubscription })
        .usecase
