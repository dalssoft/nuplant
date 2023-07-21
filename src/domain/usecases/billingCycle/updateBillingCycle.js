const { usecase, step, Ok, Err, request } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const BillingCycle = require('../../entities/billingCycle')
const BillingCycleRepository = require('../../../infra/data/repositories/billingCycleRepository')
const CustomerSubscription = require('../../entities/customerSubscription')

const dependency = { BillingCycleRepository }

const updateBillingCycle = injection =>
    usecase('Update Billing Cycle', {
        // Input/Request metadata and validation
        request: request.from(BillingCycle),

        // Output/Response metadata
        response: BillingCycle,

        // Authorization with Audit
        authorize: (user) => (user.can('UpdateBillingCycle') ? Ok() : Err()),

        setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

        'Retrieve the Billing Cycle': step(async ctx => {
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

        'Check if it is a valid Billing Cycle before update': step(ctx => {
            const oldBillingCycle = ctx.billingCycle
            const newBillingCycle = Object.assign(oldBillingCycle, BillingCycle.fromJSON(ctx.req))
            ctx.billingCycle = newBillingCycle

            return newBillingCycle.isValid({ references: { onlyIDs: true } })
                ? Ok()
                : Err.invalidEntity({
                    message: 'BillingCycle is invalid',
                    payload: { entity: 'Billing Cycle' },
                    cause: newBillingCycle.errors
                })
        }),

        'Update the Billing Cycle': step(async ctx => {
            const repo = new ctx.di.BillingCycleRepository(injection)
            const billingCycle = ctx.billingCycle
            ctx.billingCycle.customerSubscriptionId = ctx.billingCycle.customerSubscription.id
            const updated = await repo.update(billingCycle)
            updated.customerSubscription = CustomerSubscription.fromJSON({ id: updated.customerSubscriptionId })
            return (ctx.ret = updated)
        })

    })

module.exports =
    herbarium.usecases
        .add(updateBillingCycle, 'UpdateBillingCycle')
        .metadata({ group: 'BillingCycle', operation: herbarium.crud.update, entity: BillingCycle })
        .usecase
