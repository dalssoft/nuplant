const CustomerSubscription = require('../../entities/customerSubscription')
const User = require('../../entities/user')
const findAllCustomerSubscription = require('./findAllCustomerSubscription')
const assert = require('assert').strict
const { spec, scenario, given, check } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const findAllCustomerSubscriptionSpec = spec({

    usecase: findAllCustomerSubscription,

    'Find all customer Subscriptions': scenario({
        'Given an existing customer Subscription': given({
            request: { limit: 0, offset: 0 },
            user: User.fromJSON({ id: '123', permissions: ['FindAllCustomerSubscription'] }),
            injection: {
                CustomerSubscriptionRepository: class CustomerSubscriptionRepository {
                    async findAll ({ limit, offset }) {
                        const fakeCustomerSubscription = {
                            id: '1',
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

        'Must return a list of customer Subscriptions': check((ctx) => {
            assert.strictEqual(ctx.response.ok.length, 1)
            const customerSubscription = ctx.response.ok[0]
            assert.strictEqual(customerSubscription.id, '1')
            assert.strictEqual(customerSubscription.customer.id, '1')
            assert.strictEqual(customerSubscription.subscriptionPlan.id, '1')
            assert.strictEqual(customerSubscription.startDate.getTime(), new Date('2020-01-01').getTime())
            assert.strictEqual(customerSubscription.endDate.getTime(), new Date('2020-01-02').getTime())
            assert.strictEqual(customerSubscription.active, true)
        })

    })

})

module.exports =
    herbarium.specs
        .add(findAllCustomerSubscriptionSpec, 'FindAllCustomerSubscriptionSpec')
        .metadata({ usecase: 'FindAllCustomerSubscription' })
        .spec
