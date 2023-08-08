const { usecase, step, Ok, Err, request } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const BillingCycle = require('../../entities/billingCycle')
const BillingCycleRepository = require('../../../infra/data/repositories/billingCycleRepository')
const CustomerSubscription = require('../../entities/customerSubscription')

const dependency = { BillingCycleRepository }

const saveBillingCycles = injection =>
    usecase('Save Billing Cycle', {
        // Input/Request metadata and validation
        request: {
            billingCycles: [BillingCycle]
        },

        // Output/Response metadata
        response: Boolean,

        // Authorization with Audit
        authorize: (user) => (user.can('SaveBillingCycles') ? Ok() : Err()),

        setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

        // Step description and function
        'Check if the Billing Cycles are valid': step(ctx => {
            const { billingCycles } = ctx.req

            for (const billingCycle of billingCycles) {
                if (!billingCycle.isValid({ exceptIDs: true, references: { onlyIDs: true } })) {
                    return Err.invalidEntity({
                        message: 'The Billing Cycle entity is invalid',
                        payload: { entity: 'Billing Cycle' },
                        cause: billingCycle.errors
                    })
                }
            }

            return Ok()
        }),

        'Save the Billing Cycles': step(async ctx => {
            const repo = new ctx.di.BillingCycleRepository(injection)
            const { billingCycles } = ctx.req
            for (const billingCycle of billingCycles) {
                billingCycle.customerSubscriptionId = billingCycle.customerSubscription.id
                const newBillingCycle = await repo.insert(billingCycle)
                newBillingCycle.customerSubscription = CustomerSubscription.fromJSON({ id: billingCycle.customerSubscriptionId })
            }
            return Ok(ctx.ret = billingCycles)
        })
    })

module.exports =
    herbarium.nodes
        .add('SaveBillingCycles', saveBillingCycles, herbarium.node.usecase)
        .link('BillingCycle')
        .value