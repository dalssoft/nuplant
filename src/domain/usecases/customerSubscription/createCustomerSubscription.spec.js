const createCustomerSubscription = require('./createCustomerSubscription')
const assert = require('assert')
const { spec, scenario, given, check } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const createCustomerSubscriptionSpec = spec({

    usecase: createCustomerSubscription,

    'Create a new customer Subscription when it is valid': scenario({
        'Given a valid customer Subscription': given({
            request: {
                active: true
            },
            user: { hasAccess: true },
            injection: {
                CustomerSubscriptionRepository: class CustomerSubscriptionRepository {
                    async insert (customerSubscription) { return (customerSubscription) }
                }
            }
        }),

        // when: default when for use case

        'Must run without errors': check((ctx) => {
            assert.ok(ctx.response.isOk)
        }),

        'Must return a valid customer Subscription': check((ctx) => {
            assert.strictEqual(ctx.response.ok.isValid(), true)
        // TODO: check if it is really a customer Subscription
        })

    }),

    'Do not create a new customer Subscription when it is invalid': scenario({
        'Given a invalid customer Subscription': given({
            request: {
                customer: true,
                subscriptionPlan: true,
                startDate: true,
                endDate: true,
                active: true
            },
            user: { hasAccess: true },
            injection: {
                customerSubscriptionRepository: new (class CustomerSubscriptionRepository {
                    async insert (customerSubscription) { return (customerSubscription) }
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
      .add(createCustomerSubscriptionSpec, 'CreateCustomerSubscriptionSpec')
      .metadata({ usecase: 'CreateCustomerSubscription' })
      .spec
