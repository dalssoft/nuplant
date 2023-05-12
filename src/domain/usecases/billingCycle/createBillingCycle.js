const { usecase, step, Ok, Err, request } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const BillingCycle = require('../../entities/billingCycle')
const BillingCycleRepository = require('../../../infra/data/repositories/billingCycleRepository')

const dependency = { BillingCycleRepository }

const createBillingCycle = injection =>
    usecase('Create Billing Cycle', {
    // Input/Request metadata and validation
        request: request.from(BillingCycle, { ignoreIDs: true }),

        // Output/Response metadata
        response: BillingCycle,

        // Authorization with Audit
        // authorize: (user) => (user.canCreateBillingCycle ? Ok() : Err()),
        authorize: () => Ok(),

        setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

        // Step description and function
        'Check if the Billing Cycle is valid': step(ctx => {
            ctx.billingCycle = BillingCycle.fromJSON(ctx.req)
            ctx.billingCycle.id = Math.floor(Math.random() * 100000).toString()

            if (!ctx.billingCycle.isValid()) {
                return Err.invalidEntity({
                    message: 'The Billing Cycle entity is invalid',
                    payload: { entity: 'Billing Cycle' },
                    cause: ctx.billingCycle.errors
                })
            }

            // returning Ok continues to the next step. Err stops the use case execution.
            return Ok()
        }),

        'Save the Billing Cycle': step(async ctx => {
            const repo = new ctx.di.BillingCycleRepository(injection)
            const billingCycle = ctx.billingCycle
            // ctx.ret is the return value of a use case
            return (ctx.ret = await repo.insert(billingCycle))
        })
    })

module.exports =
  herbarium.usecases
      .add(createBillingCycle, 'CreateBillingCycle')
      .metadata({ group: 'BillingCycle', operation: herbarium.crud.create, entity: BillingCycle })
      .usecase
