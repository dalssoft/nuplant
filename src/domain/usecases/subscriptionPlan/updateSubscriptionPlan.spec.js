const SubscriptionPlan = require('../../entities/subscriptionPlan')
const updateSubscriptionPlan = require('./updateSubscriptionPlan')
const assert = require('assert')
const { spec, scenario, given, check, samples } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const updateSubscriptionPlanSpec = spec({

    usecase: updateSubscriptionPlan,
    'Update a existing subscription Plan when it is valid': scenario({

        'Valid subscription Plans': samples([
            {
                id: 'a text',
                name: 'a text',
                description: 'a text',
                billingFrequency: 'a text'
            },
            {
                id: 'a text',
                name: 'a text',
                description: 'a text',
                billingFrequency: 'a text'
            }
        ]),

        'Valid subscription Plans Alternative': samples([
            {
                id: 'a text',
                name: 'a text',
                description: 'a text',
                billingFrequency: 'a text'
            },
            {
                id: 'a text',
                name: 'a text',
                description: 'a text',
                billingFrequency: 'a text'
            }
        ]),

        'Given a valid subscription Plan': given((ctx) => ({
            request: ctx.sample,
            user: { hasAccess: true }
        })),

        'Given a repository with a existing subscription Plan': given((ctx) => ({
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

                    async update (id) { return true }
                }
            }
        })),

        // when: default when for use case

        'Must run without errors': check((ctx) => {
            assert.ok(ctx.response.isOk)
        }),

        'Must confirm update': check((ctx) => {
            assert.ok(ctx.response.ok === true)
        })

    }),

    'Do not update a subscription Plan when it is invalid': scenario.only({
        'Given a invalid subscription Plan': given({
            request: {
                id: true,
                name: true,
                description: true,
                billingFrequency: true,
                prices: true
            },
            user: { hasAccess: true },
            injection: {}
        }),

        // when: default when for use case

        'Must return an error': check((ctx) => {
            assert.ok(ctx.response.isErr)
        // assert.ok(ctx.response.isInvalidEntityError)
        })
    }),

    'Do not update subscription Plan if it does not exist': scenario({
        'Given an empty subscription Plan repository': given({
            request: {
                id: 'a text',
                name: 'a text',
                description: 'a text',
                billingFrequency: 'a text'
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
      .add(updateSubscriptionPlanSpec, 'UpdateSubscriptionPlanSpec')
      .metadata({ usecase: 'UpdateSubscriptionPlan' })
      .spec
