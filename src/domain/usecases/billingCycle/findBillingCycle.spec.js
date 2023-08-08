const BillingCycle = require('../../entities/billingCycle')
const User = require('../../entities/user')
const findBillingCycle = require('./findBillingCycle')
const assert = require('assert').strict
const { spec, scenario, given, check } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const findBillingCycleSpec = spec({

    usecase: findBillingCycle,

    'Find a Billing Cycle when it exists': scenario({
        'Given an existing Billing Cycle': given({
            request: {
                id: '1'
            },
            user: User.fromJSON({ id: '123', permissions: ['FindBillingCycle'] }),
            injection: {
                BillingCycleRepository: class BillingCycleRepository {
                    async findByID(id) {
                        const fakeBillingCycle = {
                            id,
                            startDate: new Date('2020-01-01'),
                            endDate: new Date('2020-01-02'),
                            amountDue: 100,
                            paymentStatus: 'pending',
                            paymentProcessorTransactionID: 'x1',
                            paymentDate: new Date('2020-01-01'),
                            customerSubscriptionId: '1'
                        }
                        return ([BillingCycle.fromJSON(fakeBillingCycle, { allowExtraKeys: true })])
                    }
                }
            }
        }),

        // when: default when for use case

        'Must run without errors': check((ctx) => {
            assert.ok(ctx.response.isOk)
        }),

        'Must return a valid billing Cycle': check((ctx) => {
            const billingCycle = ctx.response.ok
            assert.equal(billingCycle.id, '1')
            assert.deepEqual(billingCycle.startDate, new Date('2020-01-01'))
            assert.deepEqual(billingCycle.endDate, new Date('2020-01-02'))
            assert.equal(billingCycle.amountDue, 100)
            assert.equal(billingCycle.paymentStatus, 'pending')
            assert.equal(billingCycle.paymentProcessorTransactionID, 'x1')
            assert.deepEqual(billingCycle.paymentDate, new Date('2020-01-01'))
            assert.equal(billingCycle.customerSubscription.id, '1')
        })

    }),

    'Do not find a Billing Cycle when it does not exist': scenario({
        'Given an empty Billing Cycle repository': given({
            request: {
                id: '1'
            },
            user: User.fromJSON({ id: '123', permissions: ['FindBillingCycle'] }),
            injection: {
                BillingCycleRepository: class BillingCycleRepository {
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
        .add('FindBillingCycleSpec', findBillingCycleSpec, herbarium.node.spec)
        .link('FindBillingCycle')
        .value
