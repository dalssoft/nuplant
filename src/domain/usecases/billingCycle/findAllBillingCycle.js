const { usecase, step, Ok } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const BillingCycle = require('../../entities/billingCycle')
const BillingCycleRepository = require('../../../infra/data/repositories/billingCycleRepository')
const CustomerSubscription = require('../../entities/customerSubscription')

const dependency = { BillingCycleRepository }

const findAllBillingCycle = injection =>
    usecase('Find all Billing Cycles', {
    // Input/Request metadata and validation
        request: {
            limit: Number,
            offset: Number
        },

        // Output/Response metadata
        response: [BillingCycle],

        // Authorization with Audit
        authorize: () => Ok(),

        setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

        'Find and return all the Billing Cycles': step(async ctx => {
            const repo = new ctx.di.BillingCycleRepository(injection)
            const billingCycles = await repo.findAll(ctx.req)
            billingCycles.forEach(billingCycle => (billingCycle.customerSubscription = CustomerSubscription.fromJSON({ id: billingCycle.customerSubscriptionId })))
            return Ok(ctx.ret = billingCycles)
        })
    })

module.exports =
  herbarium.usecases
      .add(findAllBillingCycle, 'FindAllBillingCycle')
      .metadata({ group: 'BillingCycle', operation: herbarium.crud.readAll, entity: BillingCycle })
      .usecase
