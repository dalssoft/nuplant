const CustomerSubscription = require('../../entities/customerSubscription')
const findCustomerSubscription = require('./findCustomerSubscription')
const assert = require('assert')
const { spec, scenario, given, check } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const findCustomerSubscriptionSpec = spec({

    usecase: findCustomerSubscription,

    'Find a customer Subscription when it exists': scenario({
        'Given an existing customer Subscription': given({
            request: {
                id: 'a text'
            },
            user: { hasAccess: true },
            injection: {
                CustomerSubscriptionRepository: class CustomerSubscriptionRepository {
                    async findByID (id) {
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

        'Must return a valid customer Subscription': check((ctx) => {
            assert.strictEqual(ctx.response.ok.isValid(), true)
        })

    }),

    'Do not find a customer Subscription when it does not exist': scenario({
        'Given an empty customer Subscription repository': given({
            request: {
                id: 'a text'
            },
            user: { hasAccess: true },
            injection: {
                CustomerSubscriptionRepository: class CustomerSubscriptionRepository {
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
      .add(findCustomerSubscriptionSpec, 'FindCustomerSubscriptionSpec')
      .metadata({ usecase: 'FindCustomerSubscription' })
      .spec
