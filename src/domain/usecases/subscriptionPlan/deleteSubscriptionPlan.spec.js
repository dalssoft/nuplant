const SubscriptionPlan = require('../../entities/subscriptionPlan')
const deleteSubscriptionPlan = require('./deleteSubscriptionPlan')
const assert = require('assert')
const { spec, scenario, given, check } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const deleteSubscriptionPlanSpec = spec({

    usecase: deleteSubscriptionPlan,

    'Delete subscription Plan if exists': scenario({
        'Given an existing subscription Plan': given({
            request: {
                id: 'a text'
            },
            user: { hasAccess: true },
            injection: {
                SubscriptionPlanRepository: class SubscriptionPlanRepository {
                    async delete (entity) { return true }
                    async findByID (id) { return [SubscriptionPlan.fromJSON({ id })] }
                }
            }
        }),

        // when: default when for use case

        'Must run without errors': check((ctx) => {
            assert.ok(ctx.response.isOk)
        }),

        'Must confirm deletion': check((ctx) => {
            assert.ok(ctx.response.ok === true)
        })

    }),

    'Do not delete subscription Plan if it does not exist': scenario({
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
      .add(deleteSubscriptionPlanSpec, 'DeleteSubscriptionPlanSpec')
      .metadata({ usecase: 'DeleteSubscriptionPlan' })
      .spec
