const { usecase, step, Ok, Err, request } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const BillingCycle = require('../../entities/billingCycle')
const BillingCycleRepository = require('../../../infra/data/repositories/billingCycleRepository')
const CustomerSubscription = require('../../entities/customerSubscription')

const dependency = { BillingCycleRepository, Date }

const payBillingCycle = injection =>
    usecase('Pay Billing Cycle', {
        // Input/Request metadata and validation
        request: {
            id: String,
            paymentProcessorTransactionID: String,
        },

        // Output/Response metadata
        response: BillingCycle,

        // Authorization with Audit
        authorize: (user) => (user.can('PayBillingCycle') ? Ok() : Err()),

        setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

        'Retrieve the Billing Cycle to be paid': step(async ctx => {
            const id = ctx.req.id
            const repo = new ctx.di.BillingCycleRepository(injection)
            const [billingCycle] = await repo.findByID(id)
            ctx.billingCycle = billingCycle
            if (billingCycle === undefined) {
                return Err.notFound({
                    message: `BillingCycle not found - ID: ${id}`,
                    payload: { entity: 'Billing Cycle' }
                })
            }

            return Ok(billingCycle)
        }),

        'Check if the Billing Cycle is already paid': step(ctx => {
            const billingCycle = ctx.billingCycle
            return billingCycle.paymentStatus === 'paid'
                ? Err({
                    message: 'Billing Cycle is already paid',
                    payload: { entity: 'Billing Cycle' }
                })
                : Ok()
        }),

        'Check if it is a valid Billing Cycle before save as paid': step(ctx => {
            const billingCycle = ctx.billingCycle
            billingCycle.paymentStatus = 'paid'
            billingCycle.paymentProcessorTransactionID = ctx.req.paymentProcessorTransactionID
            billingCycle.paymentDate = new ctx.di.Date
            billingCycle.customerSubscription = CustomerSubscription.fromJSON({ id: billingCycle.customerSubscriptionId })

            return billingCycle.isValid({ references: { onlyIDs: true } })
                ? Ok()
                : Err.invalidEntity({
                    message: 'Billing Cycle is invalid',
                    payload: { entity: 'Billing Cycle' },
                    cause: billingCycle.errors
                })
        }),

        'Update the Billing Cycle': step(async ctx => {
            const repo = new ctx.di.BillingCycleRepository(injection)
            const billingCycle = ctx.billingCycle
            const updated = await repo.update(billingCycle)
            updated.customerSubscription = CustomerSubscription.fromJSON({ id: updated.customerSubscriptionId })
            return (ctx.ret = updated)
        })

    })

module.exports =
    herbarium.nodes
        .add('PayBillingCycle', payBillingCycle, herbarium.node.usecase)
        .link('BillingCycle')
        .value