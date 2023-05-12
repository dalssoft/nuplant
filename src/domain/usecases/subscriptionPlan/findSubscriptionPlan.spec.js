const SubscriptionPlan = require('../../entities/subscriptionPlan')
const findSubscriptionPlan = require('./findSubscriptionPlan')
const assert = require('assert')
const { spec, scenario, given, check } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const findSubscriptionPlanSpec = spec({

    usecase: findSubscriptionPlan,

    'Find a subscription Plan when it exists': scenario({
        'Given an existing subscription Plan': given({
            request: {
                id: 'a text'
            },
            user: { hasAccess: true },
            injection: {
                SubscriptionPlanRepository: class SubscriptionPlanRepository {
                    async findByID (id) {
                        const fakeSubscriptionPlan = {
                            id: 'a text',
                            name: 'a text',
                            description: 'a text',
                            billingFrequency: 'a text'
                        }
                        return ([SubscriptionPlan.fromJSON(fakeSubscriptionPlan)])
                    }
                }
            }
        }),

        // when: default when for use case

        'Must run without errors': check((ctx) => {
            assert.ok(ctx.response.isOk)
        }),

        'Must return a valid subscription Plan': check((ctx) => {
            assert.strictEqual(ctx.response.ok.isValid(), true)
        })

    }),

    'Do not find a subscription Plan when it does not exist': scenario({
        'Given an empty subscription Plan repository': given({
            request: {
                id: 'a text'
            },
            user: { hasAccess: true },
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
  herbarium.specs
      .add(findSubscriptionPlanSpec, 'FindSubscriptionPlanSpec')
      .metadata({ usecase: 'FindSubscriptionPlan' })
      .spec
