const User = require('../../entities/user')
const CustomerSubscription = require('../../entities/customerSubscription')
const cancelCustomerSubscription = require('./cancelCustomerSubscription')
const assert = require('assert').strict
const { spec, scenario, given, check } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const cancelCustomerSubscriptionSpec = spec({

    usecase: cancelCustomerSubscription,

    'Cancel Customer Subscription if exists': scenario({
        'Given an existing Customer Subscription': given({
            request: {
                id: '1'
            },
            user: User.fromJSON({ id: '123', permissions: ['CancelCustomerSubscription'] }),
            injection: {
                CustomerSubscriptionRepository: class CustomerSubscriptionRepository {
                    async findByID(id) {
                        const fakeCustomerSubscription = {
                            id,
                            customerId: '1',
                            subscriptionPlanId: '1',
                            startDate: new Date('2020-01-01'),
                            endDate: new Date('2020-01-02'),
                            active: true
                        }
                        return ([CustomerSubscription.fromJSON(fakeCustomerSubscription, { allowExtraKeys: true })])
                    }

                    async update(customerSubscription) { return customerSubscription }
                }
            }
        }),

        // when: default when for use case

        'Must run without errors': check((ctx) => {
            assert.ok(ctx.response.isOk)
        }),

        'Must confirm cancelation': check((ctx) => {
            assert.ok(ctx.response.ok === true)
        })

    }),

    'Do not cancel if there is no Customer Subscription for the given Customer': scenario({
        'Given an empty Customer Subscription repository': given({
            request: {
                id: '1'
            },
            user: User.fromJSON({ id: '123', permissions: ['CancelCustomerSubscription'] }),
            injection: {
                CustomerSubscriptionRepository: class CustomerSubscriptionRepository {
                    async findByID(id) {
                        return []
                    }
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
    herbarium.nodes
        .add('CancelCustomerSubscriptionSpec', cancelCustomerSubscriptionSpec, herbarium.node.spec)
        .link('CancelCustomerSubscription')
        .value