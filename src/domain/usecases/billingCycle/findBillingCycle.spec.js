const BillingCycle = require('../../entities/billingCycle')
const findBillingCycle = require('./findBillingCycle')
const assert = require('assert')
const { spec, scenario, given, check } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const findBillingCycleSpec = spec({

    usecase: findBillingCycle,

    'Find a billing Cycle when it exists': scenario({
        'Given an existing billing Cycle': given({
            request: {
                id: 'a text'
            },
            user: { hasAccess: true },
            injection: {
                BillingCycleRepository: class BillingCycleRepository {
                    async findByID (id) {
                        const fakeBillingCycle = {
                            id: 'a text',
                            amountDue: 99,
                            paymentStatus: 'a text',
                            paymentProcessorTransactionID: 'a text'
                        }
                        return ([BillingCycle.fromJSON(fakeBillingCycle)])
                    }
                }
            }
        }),

        // when: default when for use case

        'Must run without errors': check((ctx) => {
            assert.ok(ctx.response.isOk)
        }),

        'Must return a valid billing Cycle': check((ctx) => {
            assert.strictEqual(ctx.response.ok.isValid(), true)
        })

    }),

    'Do not find a billing Cycle when it does not exist': scenario({
        'Given an empty billing Cycle repository': given({
            request: {
                id: 'a text'
            },
            user: { hasAccess: true },
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
      .add(findBillingCycleSpec, 'FindBillingCycleSpec')
      .metadata({ usecase: 'FindBillingCycle' })
      .spec
