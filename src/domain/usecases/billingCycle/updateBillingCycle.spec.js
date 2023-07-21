const BillingCycle = require('../../entities/billingCycle')
const User = require('../../entities/user')
const updateBillingCycle = require('./updateBillingCycle')
const assert = require('assert').strict
const { spec, scenario, given, check, samples } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')
const CustomerSubscription = require('../../entities/customerSubscription')

const updateBillingCycleSpec = spec({

    usecase: updateBillingCycle,
    'Update a existing Billing Cycle when it is valid': scenario({

        'Valid Billing Cycles': samples([
            {
                id: '1',
                customerSubscription: CustomerSubscription.fromJSON({ id: '1' }),
                startDate: new Date('2020-01-01'),
                endDate: new Date('2020-01-02'),
                amountDue: 100,
                paymentStatus: 'pending',
                paymentProcessorTransactionID: 'x1',
                paymentDate: new Date('2020-01-01')
            }
        ]),

        'Given a valid Billing Cycle': given((ctx) => ({
            request: ctx.sample,
            user: User.fromJSON({ id: '123', permissions: ['UpdateBillingCycle'] }),
        })),

        'Given a repository with a existing Billing Cycle': given((ctx) => ({
            injection: {
                BillingCycleRepository: class BillingCycleRepository {
                    async findByID (id) {
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

                    async update (billingCycle) { return billingCycle }
                }
            }
        })),

        // when: default when for use case

        'Must run without errors': check((ctx) => {
            assert.ok(ctx.response.isOk)
        }),

        'Must confirm update': check((ctx) => {
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

    'Do not update a billing Cycle when it is invalid': scenario({
        'Given a invalid billing Cycle': given({
            request: {
                id: '1',
                customerSubscription: CustomerSubscription.fromJSON({ }),
                startDate: new Date('2020-01-01'),
                endDate: new Date('2020-01-02'),
                amountDue: 100,
                paymentStatus: 'pending',
                paymentProcessorTransactionID: 'x1',
                paymentDate: new Date('2020-01-01')
            },
            user: User.fromJSON({ id: '123', permissions: ['UpdateBillingCycle'] }),
            injection: {
                BillingCycleRepository: class BillingCycleRepository {
                    async findByID (id) {
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

        'Must return an error': check((ctx) => {
            assert.ok(ctx.response.isErr)
            assert.ok(ctx.response.isInvalidEntityError)
        })

    }),

    'Do not update billing Cycle if it does not exist': scenario({
        'Given an empty billing Cycle repository': given({
            request: {
                id: '1',
                customerSubscription: CustomerSubscription.fromJSON({ id: '1' }),
                startDate: new Date('2020-01-01'),
                endDate: new Date('2020-01-02'),
                amountDue: 100,
                paymentStatus: 'pending',
                paymentProcessorTransactionID: 'x1',
                paymentDate: new Date('2020-01-01')
            },
            user: User.fromJSON({ id: '123', permissions: ['UpdateBillingCycle'] }),
            injection: {
                BillingCycleRepository: class BillingCycleRepository {
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
        .add(updateBillingCycleSpec, 'UpdateBillingCycleSpec')
        .metadata({ usecase: 'UpdateBillingCycle' })
        .spec
