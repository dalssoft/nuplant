const CustomerSubscription = require('../../entities/customerSubscription')
const updateCustomerSubscription = require('./updateCustomerSubscription')
const assert = require('assert')
const { spec, scenario, given, check, samples } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const updateCustomerSubscriptionSpec = spec({

    usecase: updateCustomerSubscription,
    'Update a existing customer Subscription when it is valid': scenario({

        'Valid customer Subscriptions': samples([
            {
                id: 'a text',
                active: true
            },
            {
                id: 'a text',
                active: true
            }
        ]),

        'Valid customer Subscriptions Alternative': samples([
            {
                id: 'a text',
                active: true
            },
            {
                id: 'a text',
                active: true
            }
        ]),

        'Given a valid customer Subscription': given((ctx) => ({
            request: ctx.sample,
            user: { hasAccess: true }
        })),

        'Given a repository with a existing customer Subscription': given((ctx) => ({
            injection: {
                CustomerSubscriptionRepository: class CustomerSubscriptionRepository {
                    async findByID (id) {
                        const fakeCustomerSubscription = {
                            id: 'a text',
                            active: true
                        }
                        return ([CustomerSubscription.fromJSON(fakeCustomerSubscription)])
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

    'Do not update a customer Subscription when it is invalid': scenario({
        'Given a invalid customer Subscription': given({
            request: {
                id: true,
                customer: true,
                subscriptionPlan: true,
                startDate: true,
                endDate: true,
                active: true
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

    'Do not update customer Subscription if it does not exist': scenario({
        'Given an empty customer Subscription repository': given({
            request: {
                id: 'a text',
                active: true
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
      .add(updateCustomerSubscriptionSpec, 'UpdateCustomerSubscriptionSpec')
      .metadata({ usecase: 'UpdateCustomerSubscription' })
      .spec
