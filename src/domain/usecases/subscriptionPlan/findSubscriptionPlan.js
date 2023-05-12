const { usecase, step, Ok, Err } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const SubscriptionPlan = require('../../entities/subscriptionPlan')
const SubscriptionPlanRepository = require('../../../infra/data/repositories/subscriptionPlanRepository')

const dependency = { SubscriptionPlanRepository }

const findSubscriptionPlan = injection =>
    usecase('Find a Subscription Plan', {
    // Input/Request metadata and validation
        request: {
            id: String
        },

        // Output/Response metadata
        response: SubscriptionPlan,

        // Authorization with Audit
        // authorize: (user) => (user.canFindOneSubscriptionPlan ? Ok() : Err()),
        authorize: () => Ok(),

        setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

        'Find and return the Subscription Plan': step(async ctx => {
            const id = ctx.req.id
            const repo = new ctx.di.SubscriptionPlanRepository(injection)
            const [subscriptionPlan] = await repo.findByID(id)
            if (!subscriptionPlan) {
                return Err.notFound({
                    message: `Subscription Plan entity not found by ID: ${id}`,
                    payload: { entity: 'Subscription Plan', id }
                })
            }
            await repo.fetchPrices([subscriptionPlan])
            return Ok(ctx.ret = subscriptionPlan)
        })
    })

module.exports =
  herbarium.usecases
      .add(findSubscriptionPlan, 'FindSubscriptionPlan')
      .metadata({ group: 'SubscriptionPlan', operation: herbarium.crud.read, entity: SubscriptionPlan })
      .usecase
