const CustomerSubscription = require('../../entities/customerSubscription')
const findAllCustomerSubscription = require('./findAllCustomerSubscription')
const assert = require('assert')
const { spec, scenario, given, check } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const findAllCustomerSubscriptionSpec = spec({

    usecase: findAllCustomerSubscription,

    'Find all customer Subscriptions': scenario({
        'Given an existing customer Subscription': given({
            request: { limit: 0, offset: 0 },
            user: { hasAccess: true },
            injection: {
                CustomerSubscriptionRepository: class CustomerSubscriptionRepository {
                    async findAll (id) {
                        const fakeCustomerSubscription = {
                            id: 'a text',
                            active: true
                        }
                        return ([CustomerSubscription.fromJSON(fakeCustomerSubscription)])
                    }
                }
            }
        }),

        // when: default when for use case

        'Must run without errors': check((ctx) => {
            assert.ok(ctx.response.isOk)
        }),

        'Must return a list of customer Subscriptions': check((ctx) => {
            assert.strictEqual(ctx.response.ok.length, 1)
        })

    })

})

module.exports =
  herbarium.specs
      .add(findAllCustomerSubscriptionSpec, 'FindAllCustomerSubscriptionSpec')
      .metadata({ usecase: 'FindAllCustomerSubscription' })
      .spec
