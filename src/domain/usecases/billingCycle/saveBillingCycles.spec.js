const saveBillingCycles = require('./saveBillingCycles')
const User = require('../../entities/user')
const assert = require('assert').strict
const { spec, scenario, given, check } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')
const CustomerSubscription = require('../../entities/customerSubscription')
const BillingCycle = require('../../entities/billingCycle')

const saveBillingCycleSpec = spec({

    usecase: saveBillingCycles,

    'Save a new Billing Cycle when it is valid': scenario({
        'Given a valid Billing Cycle': given({
            request: {
                billingCycles: [BillingCycle.fromJSON({
                    customerSubscription: { id: '1' },
                    startDate: new Date('2020-01-01'),
                    endDate: new Date('2020-01-10'),
                    amountDue: 100,
                }),
                BillingCycle.fromJSON({
                    customerSubscription: { id: '1' },
                    startDate: new Date('2020-01-11'),
                    endDate: new Date('2020-01-20'),
                    amountDue: 100,
                })]
            },

            user: User.fromJSON({ id: '123', permissions: ['SaveBillingCycles'] }),
            injection: {
                BillingCycleRepository: class BillingCycleRepository {
                    async insert(billingCycle) { billingCycle.id = '1'; return (billingCycle) }
                }
            }
        }),

        // when: default when for use case

        'Must run without errors': check((ctx) => {
            assert.ok(ctx.response.isOk)
        }),

        'Must return a valid Billing Cycle': check((ctx) => {
            const billingCycles = ctx.response.ok
            assert.equal(billingCycles[0].customerSubscription.id, '1')
            assert.deepEqual(billingCycles[0].startDate, new Date('2020-01-01'))
            assert.deepEqual(billingCycles[0].endDate, new Date('2020-01-10'))
            assert.equal(billingCycles[0].amountDue, 100)
            assert.equal(billingCycles[0].paymentStatus, 'pending')
            assert.equal(billingCycles[0].paymentProcessorTransactionID, undefined)
            assert.deepEqual(billingCycles[0].paymentDate, undefined)

            assert.equal(billingCycles[1].customerSubscription.id, '1')
            assert.deepEqual(billingCycles[1].startDate, new Date('2020-01-11'))
            assert.deepEqual(billingCycles[1].endDate, new Date('2020-01-20'))
            assert.equal(billingCycles[1].amountDue, 100)
            assert.equal(billingCycles[1].paymentStatus, 'pending')
            assert.equal(billingCycles[1].paymentProcessorTransactionID, undefined)
            assert.deepEqual(billingCycles[1].paymentDate, undefined)
        })

    }),

    'Do not save a new Billing Cycle when it is invalid': scenario({
        'Given a invalid Billing Cycle': given({
            request: {
                billingCycles: [BillingCycle.fromJSON({
                    customerSubscription: { id: '1' },
                    startDate: 1,
                    endDate: 2,
                    amountDue: '100',
                })]
            },
            user: User.fromJSON({ id: '123', permissions: ['SaveBillingCycles'] }),
            injection: {}
        }),

        // when: default when for use case

        'Must run with errors': check((ctx) => {
            assert.ok(ctx.response.isErr)
            assert.ok(ctx.response.isInvalidEntityError)
        }),

    })
})

module.exports =
    herbarium.nodes
        .add('SaveBillingCycleSpec', saveBillingCycleSpec, herbarium.node.spec)
        .link('SaveBillingCycle')
        .value