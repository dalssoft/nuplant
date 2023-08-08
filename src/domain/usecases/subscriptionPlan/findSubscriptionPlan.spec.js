const Price = require('../../entities/price')
const User = require('../../entities/user')
const SubscriptionPlan = require('../../entities/subscriptionPlan')
const findSubscriptionPlan = require('./findSubscriptionPlan')
const assert = require('assert').strict
const { spec, scenario, given, check } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const findSubscriptionPlanSpec = spec({

    usecase: findSubscriptionPlan,

    'Find a subscription Plan when it exists': scenario({
        'Given an existing subscription Plan': given({
            request: {
                id: '1'
            },
            user: User.fromJSON({ id: '123', permissions: ['FindSubscriptionPlan'] }),
            injection: {
                SubscriptionPlanRepository: class SubscriptionPlanRepository {
                    async findByID (id) {
                        const fakeSubscriptionPlan = {
                            id,
                            name: 'Basic',
                            description: 'Basic subscription plan',
                            billingFrequency: 'm'
                        }
                        return ([SubscriptionPlan.fromJSON(fakeSubscriptionPlan)])
                    }

                    fetchPrices (subscriptionPlans) {
                        const fakePrice = Price.fromJSON({ id: '1', value: 1000 })
                        subscriptionPlans[0].prices = [fakePrice]
                    }
                }
            }
        }),

        // when: default when for use case

        'Must run without errors': check((ctx) => {
            assert.ok(ctx.response.isOk)
        }),

        'Must return a valid subscription Plan': check((ctx) => {
            const subscriptionPlan = ctx.response.ok
            assert.strictEqual(subscriptionPlan.id, '1')
            assert.strictEqual(subscriptionPlan.name, 'Basic')
            assert.strictEqual(subscriptionPlan.description, 'Basic subscription plan')
            assert.strictEqual(subscriptionPlan.billingFrequency, 'm')
            assert.strictEqual(subscriptionPlan.prices.length, 1)
            assert.strictEqual(subscriptionPlan.prices[0].id, '1')
        })

    }),

    'Do not find a subscription Plan when it does not exist': scenario({
        'Given an empty subscription Plan repository': given({
            request: {
                id: '1'
            },
            user: User.fromJSON({ id: '123', permissions: ['FindSubscriptionPlan'] }),
            injection: {
                SubscriptionPlanRepository: class SubscriptionPlanRepository {
                    async findByID (id) { return [] }
                }
            }
        }),

        // when: default when for use case

        'Must return an error': check((ctx) => {
            assert.ok(ctx.response.isErr)
            assert.ok(ctx.response.isNotFoundError)
        })
    })
})

module.exports =
    herbarium.nodes
        .add('FindSubscriptionPlanSpec', findSubscriptionPlanSpec, herbarium.node.spec)
        .link('FindSubscriptionPlan')
        .value
