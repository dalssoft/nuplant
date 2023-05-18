const BillingCycle = require('../../entities/billingCycle')
const findAllBillingCycle = require('./findAllBillingCycle')
const assert = require('assert').strict
const { spec, scenario, given, check } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const findAllBillingCycleSpec = spec({

    usecase: findAllBillingCycle,

    'Find all billing Cycles': scenario({
        'Given an existing billing Cycle': given({
            request: { limit: 0, offset: 0 },
            user: { hasAccess: true },
            injection: {
                BillingCycleRepository: class BillingCycleRepository {
                    async findAll ({ limit, offset }) {
                        const fakeBillingCycle = {
                            id: '1',
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

        'Must return a list of billing Cycles': check((ctx) => {
            assert.strictEqual(ctx.response.ok.length, 1)
            const billingCycle = ctx.response.ok[0]
            assert.equal(billingCycle.id, '1')
            assert.deepEqual(billingCycle.startDate, new Date('2020-01-01'))
            assert.deepEqual(billingCycle.endDate, new Date('2020-01-02'))
            assert.equal(billingCycle.amountDue, 100)
            assert.equal(billingCycle.paymentStatus, 'pending')
            assert.equal(billingCycle.paymentProcessorTransactionID, 'x1')
            assert.deepEqual(billingCycle.paymentDate, new Date('2020-01-01'))
            assert.equal(billingCycle.customerSubscription.id, '1')
        })

    })

})

module.exports =
    herbarium.specs
        .add(findAllBillingCycleSpec, 'FindAllBillingCycleSpec')
        .metadata({ usecase: 'FindAllBillingCycle' })
        .spec
