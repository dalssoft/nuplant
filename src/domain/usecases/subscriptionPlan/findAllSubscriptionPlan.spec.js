const SubscriptionPlan = require('../../entities/subscriptionPlan')
const findAllSubscriptionPlan = require('./findAllSubscriptionPlan')
const assert = require('assert')
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
                    async findAll (id) {
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

        'Must return a list of subscription Plans': check((ctx) => {
            assert.strictEqual(ctx.response.ok.length, 1)
        })

    })

})

module.exports =
  herbarium.specs
      .add(findAllSubscriptionPlanSpec, 'FindAllSubscriptionPlanSpec')
      .metadata({ usecase: 'FindAllSubscriptionPlan' })
      .spec
