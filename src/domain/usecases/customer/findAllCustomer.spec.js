const Customer = require('../../entities/customer')
const findAllCustomer = require('./findAllCustomer')
const assert = require('assert')
const { spec, scenario, given, check } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const findAllCustomerSpec = spec({

    usecase: findAllCustomer,

    'Find all customers': scenario({
        'Given an existing customer': given({
            request: { limit: 0, offset: 0 },
            user: { hasAccess: true },
            injection: {
                CustomerRepository: class CustomerRepository {
                    async findAll (id) {
                        const fakeCustomer = {
                            id: '1',
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

        'Must return a list of customers': check((ctx) => {
            assert.strictEqual(ctx.response.ok.length, 1)
        })

    })

})

module.exports =
  herbarium.specs
      .add(findAllCustomerSpec, 'FindAllCustomerSpec')
      .metadata({ usecase: 'FindAllCustomer' })
      .spec
