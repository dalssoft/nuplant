const { usecase, step, Ok, Err } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const CustomerSubscription = require('../../entities/customerSubscription')
const CustomerSubscriptionRepository = require('../../../infra/data/repositories/customerSubscriptionRepository')
const Customer = require('../../entities/customer')
const SubscriptionPlan = require('../../entities/subscriptionPlan')

const dependency = { CustomerSubscriptionRepository }

const findCustomerSubscriptionByCustomer = injection =>
    usecase('Find a Customer Subscription By Customer', {
    // Input/Request metadata and validation
        request: {
            id: String
        },

        // Output/Response metadata
        response: CustomerSubscription,

        // Authorization with Audit
        // authorize: (user) => (user.canFindCustomerSubscriptionByCustomer ? Ok() : Err()),
        authorize: () => Ok(),

        setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

        'Find and return the Customer Subscription': step(async ctx => {
            const id = ctx.req.id
            const repo = new ctx.di.CustomerSubscriptionRepository(injection)
            const [customerSubscription] = await repo.find({ where: { customer_id: id, active: true } })
            if (!customerSubscription) {
                return Err.notFound({
                    message: `Customer Subscription entity not found for Customer ID: ${id}`,
                    payload: { entity: 'Customer Subscription', id }
                })
            }
            customerSubscription.customer = Customer.fromJSON({ id: customerSubscription.customerId })
            customerSubscription.subscriptionPlan = SubscriptionPlan.fromJSON({ id: customerSubscription.subscriptionPlanId })
            return Ok(ctx.ret = customerSubscription)
        })
    })

module.exports =
  herbarium.usecases
      .add(findCustomerSubscriptionByCustomer, 'FindCustomerSubscriptionByCustomer')
      .metadata({ group: 'CustomerSubscription' })
      .usecase
