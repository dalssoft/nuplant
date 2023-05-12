const createCustomer = require('./createCustomer')
const assert = require('assert')
const { spec, scenario, given, check } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const createCustomerSpec = spec({

    usecase: createCustomer,

    'Create a new customer when it is valid': scenario({
        'Given a valid customer': given({
            request: {
                name: 'Samantha',
                email: 'customer@email.com',
                billingAddress: 'Street 1'
            },
            user: { hasAccess: true },
            injection: {
                CustomerRepository: class CustomerRepository {
                    async insert (customer) { return (customer) }
                }
            }
        }),

        // when: default when for use case

        'Must run without errors': check((ctx) => {
            assert.ok(ctx.response.isOk)
        }),

        'Must return a valid customer': check((ctx) => {
            assert.strictEqual(ctx.response.ok.isValid(), true)
            assert.strictEqual(ctx.response.ok.name, 'Samantha')
            assert.strictEqual(ctx.response.ok.email, 'customer@email.com')
            assert.strictEqual(ctx.response.ok.billingAddress, 'Street 1')
        })

    }),

    'Do not create a new customer when it is invalid': scenario({
        'Given a invalid customer': given({
            request: {
                name: true,
                email: true,
                billingAddress: true
            },
            user: { hasAccess: true },
            injection: {
                customerRepository: new (class CustomerRepository {
                    async insert (customer) { return (customer) }
                })()
            }
        }),

        // when: default when for use case

        'Must return an error': check((ctx) => {
            assert.ok(ctx.response.isErr)
        })

    })
})

module.exports =
    herbarium.specs
        .add(createCustomerSpec, 'CreateCustomerSpec')
        .metadata({ usecase: 'CreateCustomer' })
        .spec
