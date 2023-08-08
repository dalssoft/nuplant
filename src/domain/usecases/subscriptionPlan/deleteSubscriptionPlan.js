const { usecase, step, Ok } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const SubscriptionPlan = require('../../entities/subscriptionPlan')
const SubscriptionPlanRepository = require('../../../infra/data/repositories/subscriptionPlanRepository')

const dependency = { SubscriptionPlanRepository }

const deleteSubscriptionPlan = injection =>
    usecase('Delete Subscription Plan', {
        // Input/Request metadata and validation
        request: {
            id: String
        },

        // Output/Response metadata
        response: Boolean,

        // Authorization with Audit
        authorize: (user) => (user.can('DeleteSubscriptionPlan') ? Ok() : Err()),

        setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

        'Delete the Subscription Plan': step(async ctx => {
            ctx.subscriptionPlan = SubscriptionPlan.fromJSON({ id: ctx.req.id })
            const repo = new ctx.di.SubscriptionPlanRepository(injection)
            await repo.deletePrices(ctx.subscriptionPlan)
            await repo.delete(ctx.subscriptionPlan)
            return Ok(ctx.ret = true)
        })
    })

module.exports =
        herbarium.nodes
            .add('DeleteSubscriptionPlan', deleteSubscriptionPlan, herbarium.node.usecase)
            .metadata({ operation: herbarium.crud.delete })
            .link('SubscriptionPlan')
            .value