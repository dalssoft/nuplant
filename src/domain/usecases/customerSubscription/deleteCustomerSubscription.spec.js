const CustomerSubscription = require('../../entities/customerSubscription')
const User = require('../../entities/user')
const deleteCustomerSubscription = require('./deleteCustomerSubscription')
const assert = require('assert').strict
const { spec, scenario, given, check } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const deleteCustomerSubscriptionSpec = spec({

    usecase: deleteCustomerSubscription,

    'Delete Customer Subscription if exists': scenario({
        'Given an existing Customer Subscription': given({
            request: {
                id: '1'
            },
            user: User.fromJSON({ id: '123', permissions: ['DeleteCustomerSubscription'] }),
            injection: {
                CustomerSubscriptionRepository: class CustomerSubscriptionRepository {
                    async delete(entity) { return true }
                    async findByID(id) { return [CustomerSubscription.fromJSON({ id })] }
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

    'Do not delete Customer Subscription if it does not exist': scenario({
        'Given an empty Customer Subscription repository': given({
            request: {
                id: '1'
            },
            user: User.fromJSON({ id: '123', permissions: ['DeleteCustomerSubscription'] }),
            injection: {
                CustomerSubscriptionRepository: class CustomerSubscriptionRepository {
                    async findByID(id) { return [] }
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
        .add(deleteCustomerSubscriptionSpec, 'DeleteCustomerSubscriptionSpec')
        .metadata({ usecase: 'DeleteCustomerSubscription' })
        .spec
