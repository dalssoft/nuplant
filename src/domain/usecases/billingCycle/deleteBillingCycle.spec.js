const BillingCycle = require('../../entities/billingCycle')
const User = require('../../entities/user')
const deleteBillingCycle = require('./deleteBillingCycle')
const assert = require('assert').strict
const { spec, scenario, given, check } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const deleteBillingCycleSpec = spec({

    usecase: deleteBillingCycle,

    'Delete Billing Cycle if exists': scenario({
        'Given an existing Billing Cycle': given({
            request: {
                id: '1'
            },
            user: User.fromJSON({ id: '123', permissions: ['DeleteBillingCycle'] }),
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
                id: '1'
            },
            user: User.fromJSON({ id: '123', permissions: ['DeleteBillingCycle'] }),
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
