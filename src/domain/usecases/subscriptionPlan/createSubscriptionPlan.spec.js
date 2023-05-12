const createSubscriptionPlan = require('./createSubscriptionPlan')
const assert = require('assert')
const { spec, scenario, given, check } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const createSubscriptionPlanSpec = spec({

    usecase: createSubscriptionPlan,

    'Create a new subscription Plan when it is valid': scenario({
        'Given a valid subscription Plan': given({
            request: {
                name: 'a text',
                description: 'a text',
                billingFrequency: 'a text'
            },
            user: { hasAccess: true },
            injection: {
                SubscriptionPlanRepository: class SubscriptionPlanRepository {
                    async insert (subscriptionPlan) { return (subscriptionPlan) }
                }
            }
        }),

        // when: default when for use case

        'Must run without errors': check((ctx) => {
            assert.ok(ctx.response.isOk)
        }),

        'Must return a valid subscription Plan': check((ctx) => {
            assert.strictEqual(ctx.response.ok.isValid(), true)
        // TODO: check if it is really a subscription Plan
        })

    }),

    'Do not create a new subscription Plan when it is invalid': scenario({
        'Given a invalid subscription Plan': given({
            request: {
                name: true,
                description: true,
                billingFrequency: true,
                prices: true
            },
            user: { hasAccess: true },
            injection: {
                subscriptionPlanRepository: new (class SubscriptionPlanRepository {
                    async insert (subscriptionPlan) { return (subscriptionPlan) }
                })()
            }
        }),

        // when: default when for use case

        'Must return an error': check((ctx) => {
            assert.ok(ctx.response.isErr)
        // assert.ok(ret.isInvalidEntityError)
        })

    })
})

module.exports =
  herbarium.specs
      .add(createSubscriptionPlanSpec, 'CreateSubscriptionPlanSpec')
      .metadata({ usecase: 'CreateSubscriptionPlan' })
      .spec
