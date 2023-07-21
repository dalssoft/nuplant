const { usecase, step, Ok, Err, request } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const CustomerSubscription = require('../../entities/customerSubscription')
const CustomerSubscriptionRepository = require('../../../infra/data/repositories/customerSubscriptionRepository')
const Customer = require('../../entities/customer')
const SubscriptionPlan = require('../../entities/subscriptionPlan')

const dependency = { CustomerSubscriptionRepository }

const createCustomerSubscription = injection =>
    usecase('Create Customer Subscription', {
        // Input/Request metadata and validation
        request: request.from(CustomerSubscription, { ignoreIDs: true }),

        // Output/Response metadata
        response: CustomerSubscription,

        // Authorization with Audit
        authorize: (user) => (user.can('CreateCustomerSubscription') ? Ok() : Err()),

        setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

        'Check if the Customer Subscription is valid': step(ctx => {

            const customerSubscription = CustomerSubscription.fromJSON(ctx.req)

            if (!customerSubscription.isValid({ exceptIDs: true, references: { onlyIDs: true } }) ||
                !customerSubscription.validateDates()) {
                return Err.invalidEntity({
                    message: 'The Customer Subscription entity is invalid',
                    payload: { entity: 'Customer Subscription' },
                    cause: customerSubscription.errors
                })
            }
            ctx.customerSubscription = customerSubscription
            return Ok()
        }),

        'Check if the Customer already has a Subscription': step(async ctx => {
            const repo = new ctx.di.CustomerSubscriptionRepository(injection)
            const customer = ctx.customerSubscription.customer
            const hasActiveSubscription = await repo.hasActiveSubscription(customer)
            if (hasActiveSubscription) {
                return Err({
                    message: 'The Customer already has a Subscription',
                    payload: { entity: 'Customer Subscription' }
                })
            }
            return Ok()
        }),

        'Save the Customer Subscription': step(async ctx => {
            const repo = new ctx.di.CustomerSubscriptionRepository(injection)

            const customerSubscription = ctx.customerSubscription
            customerSubscription.customerId = customerSubscription.customer.id
            customerSubscription.subscriptionPlanId = customerSubscription.subscriptionPlan.id

            const newCustomerSubscription = await repo.insert(customerSubscription)
            newCustomerSubscription.customer = Customer.fromJSON({ id: customerSubscription.customerId })
            newCustomerSubscription.subscriptionPlan = SubscriptionPlan.fromJSON({ id: customerSubscription.subscriptionPlanId })
            return (ctx.ret = newCustomerSubscription)
        })
    })

module.exports =
    herbarium.usecases
        .add(createCustomerSubscription, 'CreateCustomerSubscription')
        .metadata({ group: 'CustomerSubscription', operation: herbarium.crud.create, entity: CustomerSubscription })
        .usecase
