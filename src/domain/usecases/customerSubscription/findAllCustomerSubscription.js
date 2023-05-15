const { usecase, step, Ok } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const CustomerSubscription = require('../../entities/customerSubscription')
const CustomerSubscriptionRepository = require('../../../infra/data/repositories/customerSubscriptionRepository')
const Customer = require('../../entities/customer')
const SubscriptionPlan = require('../../entities/subscriptionPlan')

const dependency = { CustomerSubscriptionRepository }

const findAllCustomerSubscription = injection =>
    usecase('Find all Customer Subscriptions', {
    // Input/Request metadata and validation
        request: {
            limit: Number,
            offset: Number
        },

        // Output/Response metadata
        response: [CustomerSubscription],

        // Authorization with Audit
        authorize: () => Ok(),

        setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

        'Find and return all the Customer Subscriptions': step(async ctx => {
            const repo = new ctx.di.CustomerSubscriptionRepository(injection)
            const customerSubscriptions = await repo.findAll(ctx.req)
            customerSubscriptions.forEach(customerSubscription => customerSubscription.customer = Customer.fromJSON({ id: customerSubscription.customerId }))
            customerSubscriptions.forEach(customerSubscription => customerSubscription.subscriptionPlan = SubscriptionPlan.fromJSON({ id: customerSubscription.subscriptionPlanId }))
            return Ok(ctx.ret = customerSubscriptions)
        })
    })

module.exports =
  herbarium.usecases
      .add(findAllCustomerSubscription, 'FindAllCustomerSubscription')
      .metadata({ group: 'CustomerSubscription', operation: herbarium.crud.readAll, entity: CustomerSubscription })
      .usecase
