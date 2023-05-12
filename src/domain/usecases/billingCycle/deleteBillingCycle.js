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
        // authorize: (user) => (user.canDeleteBillingCycle ? Ok() : Err()),
        authorize: () => Ok(),

        setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

        'Check if the BillingCycle exist': step(async ctx => {
            const repo = new ctx.di.BillingCycleRepository(injection)
            const [billingCycle] = await repo.findByID(ctx.req.id)
            ctx.billingCycle = billingCycle

            if (billingCycle) return Ok()
            return Err.notFound({
                message: `BillingCycle ID ${ctx.req.id} does not exist`,
                payload: { entity: 'Billing Cycle' }
            })
        }),

        'Delete the BillingCycle': step(async ctx => {
            const repo = new ctx.di.BillingCycleRepository(injection)
            ctx.ret = await repo.delete(ctx.billingCycle)
            // ctx.ret is the return value of a use case
            return Ok(ctx.ret)
        })
    })

module.exports =
  herbarium.usecases
      .add(deleteBillingCycle, 'DeleteBillingCycle')
      .metadata({ group: 'BillingCycle', operation: herbarium.crud.delete, entity: BillingCycle })
      .usecase
