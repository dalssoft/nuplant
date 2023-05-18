const SubscriptionPlan = require('../../entities/subscriptionPlan')
const findAllSubscriptionPlan = require('./findAllSubscriptionPlan')
const assert = require('assert').strict
const { spec, scenario, given, check } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const findAllSubscriptionPlanSpec = spec({

    usecase: findAllSubscriptionPlan,

    'Find all subscription Plans': scenario({
        'Given an existing subscription Plan': given({
            request: { limit: 0, offset: 0 },
            user: { hasAccess: true },
            injection: {
                SubscriptionPlanRepository: class SubscriptionPlanRepository {
                    async findAll ({ limit, offset }) {
                        const fakeSubscriptionPlan = {
                            id: '1',
                            name: 'Basic',
                            description: 'A basic plan',
                            billingFrequency: 'm'
                        }
                        return ([SubscriptionPlan.fromJSON(fakeSubscriptionPlan)])
                    }

                    fetchPrices (subscriptionPlans) {
                        const fakePrice = { id: '1', value: 1000 }
                        subscriptionPlans[0].prices = [fakePrice]
                    }
                }
            }
        }),

        // when: default when for use case

        'Must run without errors': check((ctx) => {
            assert.ok(ctx.response.isOk)
        }),

        'Must return a list of subscription Plans': check((ctx) => {
            assert.strictEqual(ctx.response.ok.length, 1)
            const subscriptionPlan = ctx.response.ok[0]
            assert.strictEqual(subscriptionPlan.id, '1')
            assert.strictEqual(subscriptionPlan.name, 'Basic')
            assert.strictEqual(subscriptionPlan.description, 'A basic plan')
            assert.strictEqual(subscriptionPlan.billingFrequency, 'm')
            assert.strictEqual(subscriptionPlan.prices.length, 1)
            assert.strictEqual(subscriptionPlan.prices[0].id, '1')
        })
    })

})

module.exports =
    herbarium.specs
        .add(findAllSubscriptionPlanSpec, 'FindAllSubscriptionPlanSpec')
        .metadata({ usecase: 'FindAllSubscriptionPlan' })
        .spec
