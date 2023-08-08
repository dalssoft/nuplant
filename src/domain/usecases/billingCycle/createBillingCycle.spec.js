const createBillingCycle = require('./createBillingCycle')
const User = require('../../entities/user')
const assert = require('assert').strict
const { spec, scenario, given, check } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')
const CustomerSubscription = require('../../entities/customerSubscription')

const createBillingCycleSpec = spec({

    usecase: createBillingCycle,

    'Create a new Billing Cycle when it is valid': scenario({
        'Given a valid Billing Cycle': given({
            request: {
                customerSubscription: CustomerSubscription.fromJSON({ id: '1' }),
                startDate: new Date('2020-01-01'),
                endDate: new Date('2020-01-02'),
                amountDue: 100,
                paymentStatus: 'pending',
                paymentProcessorTransactionID: 'x1',
                paymentDate: new Date('2020-01-01')
            },
            user: User.fromJSON({ id: '123', permissions: ['CreateBillingCycle'] }),
            injection: {
                BillingCycleRepository: class BillingCycleRepository {
                    async insert (billingCycle) { billingCycle.id = '1'; return (billingCycle) }
                }
            }
        }),

        // when: default when for use case

        'Must run without errors': check((ctx) => {
            assert.ok(ctx.response.isOk)
        }),

        'Must return a valid Billing Cycle': check((ctx) => {
            const billingCycle = ctx.response.ok
            assert.equal(billingCycle.customerSubscription.id, '1')
            assert.deepEqual(billingCycle.startDate, new Date('2020-01-01'))
            assert.deepEqual(billingCycle.endDate, new Date('2020-01-02'))
            assert.equal(billingCycle.amountDue, 100)
            assert.equal(billingCycle.paymentStatus, 'pending')
            assert.equal(billingCycle.paymentProcessorTransactionID, 'x1')
            assert.deepEqual(billingCycle.paymentDate, new Date('2020-01-01'))
        })

    }),

    'Do not create a new Billing Cycle when it is invalid': scenario({
        'Given a invalid Billing Cycle': given({
            request: {
                customerSubscription: CustomerSubscription.fromJSON({}),
                startDate: new Date('2020-01-01'),
                endDate: new Date('2020-01-02'),
                amountDue: 100,
                paymentStatus: 'pending',
                paymentProcessorTransactionID: 'x1',
                paymentDate: new Date('2020-01-01')
            },
            user: User.fromJSON({ id: '123', permissions: ['CreateBillingCycle'] }),
            injection: {
                billingCycleRepository: new (class BillingCycleRepository {
                    async insert (billingCycle) { return (billingCycle) }
                })()
            }
        }),

        // when: default when for use case

        'Must return an error': check((ctx) => {
            assert.ok(ctx.response.isErr)
            assert.ok(ctx.response.isInvalidEntityError)
        })

    })
})

module.exports =
    herbarium.nodes
        .add('CreateBillingCycleSpec', createBillingCycleSpec, herbarium.node.spec)
        .link('CreateBillingCycle')
        .value
