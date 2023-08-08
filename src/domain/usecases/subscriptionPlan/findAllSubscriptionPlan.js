const { usecase, step, Ok } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const SubscriptionPlan = require('../../entities/subscriptionPlan')
const SubscriptionPlanRepository = require('../../../infra/data/repositories/subscriptionPlanRepository')

const dependency = { SubscriptionPlanRepository }

const findAllSubscriptionPlan = injection =>
    usecase('Find all Subscription Plans', {
        // Input/Request metadata and validation
        request: {
            limit: Number,
            offset: Number
        },

        // Output/Response metadata
        response: [SubscriptionPlan],

        // Authorization with Audit
        authorize: (user) => (user.can('FindAllSubscriptionPlan') ? Ok() : Err()),

        setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

        'Find and return all the Subscription Plans': step(async ctx => {
            const repo = new ctx.di.SubscriptionPlanRepository(injection)
            const subscriptionPlans = await repo.findAll(ctx.req)
            await repo.fetchPrices(subscriptionPlans)
            // ctx.ret is the return value of a use case
            return Ok(ctx.ret = subscriptionPlans)
        })
    })
    
module.exports =
        herbarium.nodes
            .add('FindAllSubscriptionPlan', findAllSubscriptionPlan, herbarium.node.usecase)
            .metadata({ operation: herbarium.crud.readAll })
            .link('SubscriptionPlan')
            .value
            