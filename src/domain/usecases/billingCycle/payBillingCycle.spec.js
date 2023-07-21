const BillingCycle = require('../../entities/billingCycle')
const User = require('../../entities/user')
const payBillingCycle = require('./payBillingCycle')
const assert = require('assert').strict
const { spec, scenario, given, check, samples } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')
const CustomerSubscription = require('../../entities/customerSubscription')

const payBillingCycleSpec = spec({

    usecase: payBillingCycle,
    
    'Pay a existing Billing Cycle': scenario({

        'Valid Billing Cycles': samples([
            {
                request: {
                    id: '1',
                    paymentProcessorTransactionID: 'x1',
                },
                old: {
                    id: '1',
                    customerSubscription: CustomerSubscription.fromJSON({ id: '1' }),
                    startDate: new Date('2020-01-01'),
                    endDate: new Date('2020-01-02'),
                    amountDue: 100,
                    paymentStatus: 'pending',
                    paymentProcessorTransactionID: undefined,
                    paymentDate: undefined,
                    customerSubscriptionId: '1'
                }
            }
        ]),

        'Given a existing Billing Cycle': given((ctx) => ({
            request: ctx.sample.request,
            user: User.fromJSON({ id: '123', permissions: ['PayBillingCycle'] }),
        })),

        'Given a repository with a existing Billing Cycle': given((ctx) => ({
            injection: {
                BillingCycleRepository: class BillingCycleRepository {
                    async findByID(id) {
                        const fakeBillingCycle = ctx.sample.old
                        return ([BillingCycle.fromJSON(fakeBillingCycle, { allowExtraKeys: true })])
                    }

                    async update(billingCycle) { return billingCycle }
                },
                Date: class DateFake {
                    constructor() { return new Date('2023-01-01') }
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
            assert.equal(billingCycle.paymentStatus, 'paid')
            assert.equal(billingCycle.paymentProcessorTransactionID, 'x1')
            assert.deepEqual(billingCycle.paymentDate, new Date('2023-01-01'))
        })

    }),

    'Do not pay Billing Cycle if it does not exist': scenario({
        'Given an empty billing Cycle repository': given({
            request: {
                id: '1',
                paymentProcessorTransactionID: undefined,
            },
            user: User.fromJSON({ id: '123', permissions: ['PayBillingCycle'] }),
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
    }),

    'Do not pay Billing Cycle if it is already paid': scenario({
        'Given a repository with a existing Billing Cycle': given({
            request: {
                id: '1',
                paymentProcessorTransactionID: undefined,
            },
            user: User.fromJSON({ id: '123', permissions: ['PayBillingCycle'] }),
            injection: {
                BillingCycleRepository: class BillingCycleRepository {
                    async findByID(id) {
                        const fakeBillingCycle = {
                            id: '1',
                            customerSubscription: CustomerSubscription.fromJSON({ id: '1' }),
                            startDate: new Date('2020-01-01'),
                            endDate: new Date('2020-01-02'),
                            amountDue: 100,
                            paymentStatus: 'paid',
                            paymentProcessorTransactionID: undefined,
                            paymentDate: undefined,
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
            assert.equal(ctx.response.err.message, 'Billing Cycle is already paid')
        })
    })
})

module.exports =
    herbarium.specs
        .add(payBillingCycleSpec, 'PayBillingCycleSpec')
        .metadata({ usecase: 'PayBillingCycle' })
        .spec
