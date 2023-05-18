const Customer = require('../../entities/customer')
const findCustomer = require('./findCustomer')
const assert = require('assert').strict
const { spec, scenario, given, check } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const findCustomerSpec = spec({

    usecase: findCustomer,

    'Find a customer when it exists': scenario({
        'Given an existing customer': given({
            request: {
                id: '1'
            },
            user: { hasAccess: true },
            injection: {
                CustomerRepository: class CustomerRepository {
                    async findByID (id) {
                        const fakeCustomer = {
                            id,
                            name: 'Samantha',
                            email: 'customer@email.com',
                            billingAddress: 'Street 1'
                        }
                        return ([Customer.fromJSON(fakeCustomer)])
                    }
                }
            }
        }),

        // when: default when for use case

        'Must run without errors': check((ctx) => {
            assert.ok(ctx.response.isOk)
        }),

        'Must return a valid customer': check((ctx) => {
            assert.strictEqual(ctx.response.ok.isValid(), true)
        })

    }),

    'Do not find a customer when it does not exist': scenario({
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
      .add(findCustomerSpec, 'FindCustomerSpec')
      .metadata({ usecase: 'FindCustomer' })
      .spec
