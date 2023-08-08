const deleteSubscriptionPlan = require('./deleteSubscriptionPlan')
const User = require('../../entities/user')
const assert = require('assert').strict
const { spec, scenario, given, check } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const deleteSubscriptionPlanSpec = spec({

    usecase: deleteSubscriptionPlan,

    'Delete subscription Plan if exists': scenario({
        'Given an existing subscription Plan': given({
            request: {
                id: '1'
            },
            user: User.fromJSON({ id: '123', permissions: ['DeleteSubscriptionPlan'] }),
            injection: {
                SubscriptionPlanRepository: class SubscriptionPlanRepository {
                    async delete(entity) { return true }
                    async deletePrices(entity) { return true }
                }
            }
        }),

        // when: default when for use case

        'Must run without errors': check((ctx) => {
            assert.ok(ctx.response.isOk)
        }),

        'Must confirm deletion': check((ctx) => {
            assert.deepEqual(ctx.response.ok, true)
        })

    })
})

module.exports =
    herbarium.nodes
        .add('DeleteSubscriptionPlanSpec', deleteSubscriptionPlanSpec, herbarium.node.spec)
        .link('DeleteSubscriptionPlan')
        .value