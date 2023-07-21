const { usecase, step, Ok, Err } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const BillingCycle = require('../../entities/billingCycle')
const BillingCycleRepository = require('../../../infra/data/repositories/billingCycleRepository')
const CustomerSubscription = require('../../entities/customerSubscription')

const dependency = { BillingCycleRepository }

const findBillingCycle = injection =>
    usecase('Find a Billing Cycle', {
        // Input/Request metadata and validation
        request: {
            id: String
        },

        // Output/Response metadata
        response: BillingCycle,

        // Authorization with Audit
        authorize: (user) => (user.can('FindBillingCycle') ? Ok() : Err()),

        setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

        'Find and return the Billing Cycle': step(async ctx => {
            const id = ctx.req.id
            const repo = new ctx.di.BillingCycleRepository(injection)
            const [billingCycle] = await repo.findByID(id)
            if (!billingCycle) {
                return Err.notFound({
                    message: `Billing Cycle entity not found by ID: ${id}`,
                    payload: { entity: 'Billing Cycle', id }
                })
            }
            billingCycle.customerSubscription = CustomerSubscription.fromJSON({ id: billingCycle.customerSubscriptionId })
            return Ok(ctx.ret = billingCycle)
        })
    })

module.exports =
    herbarium.usecases
        .add(findBillingCycle, 'FindBillingCycle')
        .metadata({ group: 'BillingCycle', operation: herbarium.crud.read, entity: BillingCycle })
        .usecase
