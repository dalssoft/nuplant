const { usecase, step, ifElse, Ok, Err, request } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const CustomerSubscription = require('../../entities/customerSubscription')
const CustomerSubscriptionRepository = require('../../../infra/data/repositories/customerSubscriptionRepository')
const Customer = require('../../entities/customer')
const SubscriptionPlan = require('../../entities/subscriptionPlan')
const BillingCycle = require('../../entities/billingCycle')
const SaveBillingCycles = require('../billingCycle/saveBillingCycles')
const FindSubscriptionPlan = require('../subscriptionPlan/findSubscriptionPlan')
const FindAllPrice = require('../price/findAllPrice')
const { stepUseCase } = require('../../../infra/herbs/stepUseCase')

const dependency = { CustomerSubscriptionRepository, SaveBillingCycles, FindSubscriptionPlan, FindAllPrice }

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
            ctx.customerSubscription = newCustomerSubscription
            return Ok()
        }),

        'Check if it is a Contracted Subscription': ifElse({
            'If it is a Contracted Subscription': step(ctx => {
                const customerSubscription = ctx.customerSubscription
                return Ok(customerSubscription.isContracted())
            }),

            'Then create all the Billing Cycles': step({

                'Retrieve the Subscription Plan': stepUseCase({
                    usecase: (ctx) => ctx.di.FindSubscriptionPlan,
                    user: (ctx) => ctx.user,
                    request: (ctx) => ({ id: ctx.customerSubscription.subscriptionPlan.id }),
                    response: (ctx, response) => {
                        const subscriptionPlan = response
                        ctx.customerSubscription.subscriptionPlan = subscriptionPlan
                    },
                    injection
                }),

                'Retrieve the Prices': stepUseCase({
                    usecase: (ctx) => ctx.di.FindAllPrice,
                    user: (ctx) => ctx.user,
                    request: (ctx) => ({ ids: ctx.customerSubscription.subscriptionPlan.prices.map(price => price.id) }),
                    response: (ctx, response) => {
                        const prices = response
                        ctx.customerSubscription.subscriptionPlan.prices = prices
                    },
                    injection
                }),

                'Create the Billing Cycles for the Contracted Subscription': step(ctx => {
                    const billingCycles = []
                    let billingCycle = BillingCycle.fromJSON({ customerSubscription: ctx.customerSubscription })
                    billingCycle.initializeAsFirst()
                    billingCycles.push(billingCycle)
                    while (billingCycle !== null) {
                        billingCycle = billingCycle.createNext()
                        if (billingCycle !== null) billingCycles.push(billingCycle)
                    }
                    ctx.billingCycles = billingCycles
                }),

                'Save all the Billing Cycles': stepUseCase({
                    usecase: (ctx) => ctx.di.SaveBillingCycles,
                    user: (ctx) => ctx.user,
                    request: (ctx) => ({ billingCycles: ctx.billingCycles }),
                    response: (ctx, response) => {
                        const billingCycles = response
                        ctx.billingCycles = billingCycles
                    },
                    injection
                })
            }),
            'Else, nothing to do': step(ctx => { })
        }),

        'Return the new Customer Subscription': step(ctx => {
            const customerSubscription = ctx.customerSubscription
            const billingCycles = ctx.billingCycles
            customerSubscription.billingCycles = billingCycles
            ctx.ret = customerSubscription
        })
    })

module.exports =
    herbarium.usecases
        .add(createCustomerSubscription, 'CreateCustomerSubscription')
        .metadata({ group: 'CustomerSubscription', operation: herbarium.crud.create, entity: CustomerSubscription })
        .usecase
