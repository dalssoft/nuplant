const CustomerSubscription = require('../../entities/customerSubscription')
const User = require('../../entities/user')
const assert = require('assert').strict
const { spec, scenario, given, check } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')
const findCustomerSubscriptionByCustomer = require('./findCustomerSubscriptionByCustomer')

const findCustomerSubscriptionByCustomerSpec = spec({

    usecase: findCustomerSubscriptionByCustomer,

    'Find a Customer Subscription when customer exists': scenario({
        'Given an active Customer Subscription for a Customer': given({
            request: {
                id: '1'
            },
            user: User.fromJSON({ id: '123', permissions: ['FindCustomerSubscriptionByCustomer'] }),
            injection: {
                CustomerSubscriptionRepository: class CustomerSubscriptionRepository {
                    async find({ where }) {
                        const fakeCustomerSubscription = {
                            id: '1',
                            customerId: where.customer_id,
                            subscriptionPlanId: '1',
                            startDate: new Date('2020-01-01'),
                            endDate: new Date('2020-01-02'),
                            active: true
                        }
                        return ([CustomerSubscription.fromJSON(fakeCustomerSubscription, { allowExtraKeys: true })])
                    }
                }
            }
        }),

        // when: default when for use case

        'Must run without errors': check((ctx) => {
            assert.ok(ctx.response.isOk)
        }),

        'Must return a valid Customer Subscription': check((ctx) => {
            const customerSubscription = ctx.response.ok
            assert.strictEqual(customerSubscription.id, '1')
            assert.strictEqual(customerSubscription.customer.id, '1')
            assert.strictEqual(customerSubscription.subscriptionPlan.id, '1')
            assert.strictEqual(customerSubscription.startDate.getTime(), new Date('2020-01-01').getTime())
            assert.strictEqual(customerSubscription.endDate.getTime(), new Date('2020-01-02').getTime())
            assert.strictEqual(customerSubscription.active, true)
        })

    }),

    'Do not find a Customer Subscription when customer does not exist': scenario({
        'Given an empty Customer Subscription repository': given({
            request: {
                id: '1'
            },
            user: User.fromJSON({ id: '123', permissions: ['FindCustomerSubscriptionByCustomer'] }),
            injection: {
                CustomerSubscriptionRepository: class CustomerSubscriptionRepository {
                    async find({ where }) {
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
        .add('FindCustomerSubscriptionByCustomerSpec', findCustomerSubscriptionByCustomerSpec, herbarium.node.spec)
        .link('FindCustomerSubscriptionByCustomer')
        .value