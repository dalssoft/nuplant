const Customer = require('../../entities/customer')
const deleteCustomer = require('./deleteCustomer')
const assert = require('assert').strict
const { spec, scenario, given, check } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const deleteCustomerSpec = spec({

    usecase: deleteCustomer,

    'Delete customer if exists': scenario({
        'Given an existing customer': given({
            request: {
                id: '1'
            },
            user: { hasAccess: true },
            injection: {
                CustomerRepository: class CustomerRepository {
                    async delete (entity) { return true }
                    async findByID (id) { return [Customer.fromJSON({ id })] }
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

    'Do not delete customer if it does not exist': scenario({
        'Given an empty customer repository': given({
            request: {
                id: '1'
            },
            user: { hasAccess: true },
            injection: {
                CustomerRepository: class CustomerRepository {
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
      .add(deleteCustomerSpec, 'DeleteCustomerSpec')
      .metadata({ usecase: 'DeleteCustomer' })
      .spec
