const CustomerSubscription = require('../../entities/customerSubscription')
const User = require('../../entities/user')
const findCustomerSubscription = require('./findCustomerSubscription')
const assert = require('assert').strict
const { spec, scenario, given, check } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const findCustomerSubscriptionSpec = spec({

    usecase: findCustomerSubscription,

    'Find a Customer Subscription when it exists': scenario({
        'Given an existing Customer Subscription': given({
            request: {
                id: '1'
            },
            user: User.fromJSON({ id: '123', permissions: ['FindCustomerSubscription'] }),
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

    'Do not find a Customer Subscription when it does not exist': scenario({
        'Given an empty Customer Subscription repository': given({
            request: {
                id: '1'
            },
            user: User.fromJSON({ id: '123', permissions: ['FindCustomerSubscription'] }),
            injection: {
                CustomerSubscriptionRepository: class CustomerSubscriptionRepository {
                    async findByID(id) { return [] }
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
        .add('FindCustomerSubscriptionSpec', findCustomerSubscriptionSpec, herbarium.node.spec)
        .link('FindCustomerSubscription')
        .value