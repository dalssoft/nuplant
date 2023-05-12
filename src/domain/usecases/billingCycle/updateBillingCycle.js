const { usecase, step, Ok, Err, request } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const merge = require('deepmerge')
const BillingCycle = require('../../entities/billingCycle')
const BillingCycleRepository = require('../../../infra/data/repositories/billingCycleRepository')

const dependency = { BillingCycleRepository }

const updateBillingCycle = injection =>
    usecase('Update Billing Cycle', {
    // Input/Request metadata and validation
        request: request.from(BillingCycle),

        // Output/Response metadata
        response: BillingCycle,

        // Authorization with Audit
        // authorize: (user) => (user.canUpdateBillingCycle ? Ok() : Err()),
        authorize: () => Ok(),

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
            const newBillingCycle = BillingCycle.fromJSON(merge.all([oldBillingCycle, ctx.req]))
            ctx.billingCycle = newBillingCycle

            return newBillingCycle.isValid()
                ? Ok()
                : Err.invalidEntity({
                    message: 'BillingCycle is invalid',
                    payload: { entity: 'Billing Cycle' },
                    cause: newBillingCycle.errors
                })
        }),

        'Update the BillingCycle': step(async ctx => {
            const repo = new ctx.di.BillingCycleRepository(injection)
            // ctx.ret is the return value of a use case
            return (ctx.ret = await repo.update(ctx.billingCycle))
        })

    })

module.exports =
  herbarium.usecases
      .add(updateBillingCycle, 'UpdateBillingCycle')
      .metadata({ group: 'BillingCycle', operation: herbarium.crud.update, entity: BillingCycle })
      .usecase
