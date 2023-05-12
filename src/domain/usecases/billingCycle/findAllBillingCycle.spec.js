const BillingCycle = require('../../entities/billingCycle')
const findAllBillingCycle = require('./findAllBillingCycle')
const assert = require('assert')
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
                    async findAll (id) {
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

        'Must return a list of billing Cycles': check((ctx) => {
            assert.strictEqual(ctx.response.ok.length, 1)
        })

    })

})

module.exports =
  herbarium.specs
      .add(findAllBillingCycleSpec, 'FindAllBillingCycleSpec')
      .metadata({ usecase: 'FindAllBillingCycle' })
      .spec
