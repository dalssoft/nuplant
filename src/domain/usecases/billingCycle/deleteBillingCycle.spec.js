const BillingCycle = require('../../entities/billingCycle')
const deleteBillingCycle = require('./deleteBillingCycle')
const assert = require('assert')
const { spec, scenario, given, check } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const deleteBillingCycleSpec = spec({

    usecase: deleteBillingCycle,

    'Delete billing Cycle if exists': scenario({
        'Given an existing billing Cycle': given({
            request: {
                id: 'a text'
            },
            user: { hasAccess: true },
            injection: {
                BillingCycleRepository: class BillingCycleRepository {
                    async delete (entity) { return true }
                    async findByID (id) { return [BillingCycle.fromJSON({ id })] }
                }
            }
        }),

        // when: default when for use case

        'Must run without errors': check((ctx) => {
            assert.ok(ctx.response.isOk)
        }),

        'Must confirm deletion': check((ctx) => {
            assert.ok(ctx.response.ok === true)
        })

    }),

    'Do not delete billing Cycle if it does not exist': scenario({
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
      .add(deleteBillingCycleSpec, 'DeleteBillingCycleSpec')
      .metadata({ usecase: 'DeleteBillingCycle' })
      .spec
