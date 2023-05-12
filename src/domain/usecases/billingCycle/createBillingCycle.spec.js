const createBillingCycle = require('./createBillingCycle')
const assert = require('assert')
const { spec, scenario, given, check } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const createBillingCycleSpec = spec({

    usecase: createBillingCycle,

    'Create a new billing Cycle when it is valid': scenario({
        'Given a valid billing Cycle': given({
            request: {
                amountDue: 99,
                paymentStatus: 'a text',
                paymentProcessorTransactionID: 'a text'
            },
            user: { hasAccess: true },
            injection: {
                BillingCycleRepository: class BillingCycleRepository {
                    async insert (billingCycle) { return (billingCycle) }
                }
            }
        }),

        // when: default when for use case

        'Must run without errors': check((ctx) => {
            assert.ok(ctx.response.isOk)
        }),

        'Must return a valid billing Cycle': check((ctx) => {
            assert.strictEqual(ctx.response.ok.isValid(), true)
        // TODO: check if it is really a billing Cycle
        })

    }),

    'Do not create a new billing Cycle when it is invalid': scenario({
        'Given a invalid billing Cycle': given({
            request: {
                customerSubscription: true,
                startDate: true,
                endDate: true,
                amountDue: true,
                paymentStatus: true,
                paymentProcessorTransactionID: true,
                paymentDate: true
            },
            user: { hasAccess: true },
            injection: {
                billingCycleRepository: new (class BillingCycleRepository {
                    async insert (billingCycle) { return (billingCycle) }
                })()
            }
        }),

        // when: default when for use case

        'Must return an error': check((ctx) => {
            assert.ok(ctx.response.isErr)
        // assert.ok(ret.isInvalidEntityError)
        })

    })
})

module.exports =
  herbarium.specs
      .add(createBillingCycleSpec, 'CreateBillingCycleSpec')
      .metadata({ usecase: 'CreateBillingCycle' })
      .spec
