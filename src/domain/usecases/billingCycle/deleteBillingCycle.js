const { usecase, step, Ok, Err } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const BillingCycle = require('../../entities/billingCycle')
const BillingCycleRepository = require('../../../infra/data/repositories/billingCycleRepository')

const dependency = { BillingCycleRepository }

const deleteBillingCycle = injection =>
    usecase('Delete Billing Cycle', {
        // Input/Request metadata and validation
        request: {
            id: String
        },

        // Output/Response metadata
        response: Boolean,

        // Authorization with Audit
        authorize: (user) => (user.can('DeleteBillingCycle') ? Ok() : Err()),

        setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

        'Check if the Billing Cycle exist': step(async ctx => {
            const repo = new ctx.di.BillingCycleRepository(injection)
            const [billingCycle] = await repo.findByID(ctx.req.id)
            ctx.billingCycle = billingCycle

            if (billingCycle) return Ok()
            return Err.notFound({
                message: `Billing Cycle ID ${ctx.req.id} does not exist`,
                payload: { entity: 'Billing Cycle' }
            })
        }),

        'Delete the Billing Cycle': step(async ctx => {
            const repo = new ctx.di.BillingCycleRepository(injection)
            ctx.ret = await repo.delete(ctx.billingCycle)
            return Ok(ctx.ret)
        })
    })

module.exports =
    herbarium.nodes
        .add('DeleteBillingCycle', deleteBillingCycle, herbarium.node.usecase)
        .link('BillingCycle')
        .metadata({ operation: herbarium.crud.delete })
        .value