const BillingCycle = require('../../entities/billingCycle')
const updateBillingCycle = require('./updateBillingCycle')
const assert = require('assert')
const { spec, scenario, given, check, samples } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const updateBillingCycleSpec = spec({

    usecase: updateBillingCycle,
    'Update a existing billing Cycle when it is valid': scenario({

        'Valid billing Cycles': samples([
            {
                id: 'a text',
                amountDue: 99,
                paymentStatus: 'a text',
                paymentProcessorTransactionID: 'a text'
            },
            {
                id: 'a text',
                amountDue: 99,
                paymentStatus: 'a text',
                paymentProcessorTransactionID: 'a text'
            }
        ]),

        'Valid billing Cycles Alternative': samples([
            {
                id: 'a text',
                amountDue: 99,
                paymentStatus: 'a text',
                paymentProcessorTransactionID: 'a text'
            },
            {
                id: 'a text',
                amountDue: 99,
                paymentStatus: 'a text',
                paymentProcessorTransactionID: 'a text'
            }
        ]),

        'Given a valid billing Cycle': given((ctx) => ({
            request: ctx.sample,
            user: { hasAccess: true }
        })),

        'Given a repository with a existing billing Cycle': given((ctx) => ({
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

                    async update (id) { return true }
                }
            }
        })),

        // when: default when for use case

        'Must run without errors': check((ctx) => {
            assert.ok(ctx.response.isOk)
        }),

        'Must confirm update': check((ctx) => {
            assert.ok(ctx.response.ok === true)
        })

    }),

    'Do not update a billing Cycle when it is invalid': scenario({
        'Given a invalid billing Cycle': given({
            request: {
                id: true,
                customerSubscription: true,
                startDate: true,
                endDate: true,
                amountDue: true,
                paymentStatus: true,
                paymentProcessorTransactionID: true,
                paymentDate: true
            },
            user: { hasAccess: true },
            injection: {}
        }),

        // when: default when for use case

        'Must return an error': check((ctx) => {
            assert.ok(ctx.response.isErr)
        // assert.ok(ctx.response.isInvalidEntityError)
        })

    }),

    'Do not update billing Cycle if it does not exist': scenario({
        'Given an empty billing Cycle repository': given({
            request: {
                id: 'a text',
                amountDue: 99,
                paymentStatus: 'a text',
                paymentProcessorTransactionID: 'a text'
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
      .add(updateBillingCycleSpec, 'UpdateBillingCycleSpec')
      .metadata({ usecase: 'UpdateBillingCycle' })
      .spec
