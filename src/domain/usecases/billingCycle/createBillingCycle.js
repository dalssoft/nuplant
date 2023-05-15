const { usecase, step, Ok, Err, request } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const BillingCycle = require('../../entities/billingCycle')
const BillingCycleRepository = require('../../../infra/data/repositories/billingCycleRepository')
const CustomerSubscription = require('../../entities/customerSubscription')

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

            if (!ctx.billingCycle.isValid({ exceptIDs: true, references: { onlyIDs: true } })) {
                return Err.invalidEntity({
                    message: 'The Billing Cycle entity is invalid',
                    payload: { entity: 'Billing Cycle' },
                    cause: ctx.billingCycle.errors
                })
            }
            return Ok()
        }),

        'Save the Billing Cycle': step(async ctx => {
            const repo = new ctx.di.BillingCycleRepository(injection)
            const billingCycle = ctx.billingCycle
            billingCycle.customerSubscriptionId = billingCycle.customerSubscription.id
            const newBillingCycle = await repo.insert(billingCycle)
            newBillingCycle.customerSubscription = CustomerSubscription.fromJSON({ id: billingCycle.customerSubscriptionId })
            return (ctx.ret = newBillingCycle)
        })
    })

module.exports =
  herbarium.usecases
      .add(createBillingCycle, 'CreateBillingCycle')
      .metadata({ group: 'BillingCycle', operation: herbarium.crud.create, entity: BillingCycle })
      .usecase
