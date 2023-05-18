const { usecase, step, Ok, Err, request } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const SubscriptionPlan = require('../../entities/subscriptionPlan')
const SubscriptionPlanRepository = require('../../../infra/data/repositories/subscriptionPlanRepository')

const dependency = { SubscriptionPlanRepository }

const updateSubscriptionPlan = injection =>
    usecase('Update Subscription Plan', {
        // Input/Request metadata and validation
        request: request.from(SubscriptionPlan),

        // Output/Response metadata
        response: SubscriptionPlan,

        // Authorization with Audit
        // authorize: (user) => (user.canUpdateSubscriptionPlan ? Ok() : Err()),
        authorize: () => Ok(),

        setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

        'Retrieve the Subscription Plan': step(async ctx => {
            const id = ctx.req.id
            const repo = new ctx.di.SubscriptionPlanRepository(injection)
            const [subscriptionPlan] = await repo.findByID(id)
            ctx.subscriptionPlan = subscriptionPlan
            if (subscriptionPlan === undefined) {
                return Err.notFound({
                    message: `SubscriptionPlan not found - ID: ${id}`,
                    payload: { entity: 'Subscription Plan' }
                })
            }

            return Ok(subscriptionPlan)
        }),

        'Check if it is a valid Subscription Plan before update': step(ctx => {
            const oldSubscriptionPlan = ctx.subscriptionPlan
            const newSubscriptionPlan = Object.assign(oldSubscriptionPlan, SubscriptionPlan.fromJSON(ctx.req))
            ctx.subscriptionPlan = newSubscriptionPlan

            return newSubscriptionPlan.isValid({ references: { onlyIDs: true } })
                ? Ok()
                : Err.invalidEntity({
                    message: 'Subscription Plan is invalid',
                    payload: { entity: 'Subscription Plan' },
                    cause: newSubscriptionPlan.errors
                })
        }),

        'Update the Subscription Plan': step(async ctx => {
            const repo = new ctx.di.SubscriptionPlanRepository(injection)
            await repo.deletePrices(ctx.subscriptionPlan)
            const saved = await repo.update(ctx.subscriptionPlan)
            saved.prices = await repo.insertPrices(ctx.subscriptionPlan)
            return Ok(ctx.ret = saved)
        })
    })

module.exports =
    herbarium.usecases
        .add(updateSubscriptionPlan, 'UpdateSubscriptionPlan')
        .metadata({ group: 'SubscriptionPlan', operation: herbarium.crud.update, entity: SubscriptionPlan })
        .usecase
