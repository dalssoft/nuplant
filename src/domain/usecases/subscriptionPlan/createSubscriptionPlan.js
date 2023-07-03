const { usecase, step, Ok, Err, request } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const SubscriptionPlan = require('../../entities/subscriptionPlan')
const SubscriptionPlanRepository = require('../../../infra/data/repositories/subscriptionPlanRepository')

const dependency = { SubscriptionPlanRepository }

const createSubscriptionPlan = injection =>
    usecase('Create Subscription Plan', {
    // Input/Request metadata and validation
        request: request.from(SubscriptionPlan, { ignoreIDs: true }),

        // Output/Response metadata
        response: SubscriptionPlan,

        // Authorization with Audit
        // authorize: (user) => (user.canCreateSubscriptionPlan ? Ok() : Err()),
        authorize: () => Ok(),

        setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

        'Check if the Subscription Plan is valid': step(ctx => {
            ctx.subscriptionPlan = SubscriptionPlan.fromJSON(ctx.req)

            if (!ctx.subscriptionPlan.isValid({ exceptIDs: true, references: { onlyIDs: true } })) {
                return Err.invalidEntity({
                    message: 'The Subscription Plan entity is invalid',
                    payload: { entity: 'Subscription Plan' },
                    cause: ctx.subscriptionPlan.errors
                })
            }
            return Ok()
        }),

        'Save the Subscription Plan': step(async ctx => {
            const repo = new ctx.di.SubscriptionPlanRepository(injection)
            const toBeSaved = ctx.subscriptionPlan
            const saved = await repo.insert(toBeSaved)
            toBeSaved.id = saved.id
            saved.prices = await repo.insertPrices(toBeSaved)
            return Ok(ctx.ret = saved)
        })
    })

module.exports =
  herbarium.usecases
      .add(createSubscriptionPlan, 'CreateSubscriptionPlan')
      .metadata({ group: 'SubscriptionPlan', operation: herbarium.crud.create, entity: SubscriptionPlan })
      .usecase
