const createCustomer = require('./createCustomer')
const User = require('../../entities/user')
const assert = require('assert').strict
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
            user: User.fromJSON({ id: '123', permissions: ['CreateCustomer'] }),
            injection: {
                CustomerRepository: class CustomerRepository {
                    async insert(customer) { customer.id = '1'; return (customer) }
                }
            }
        }),

        // when: default when for use case

        'Must run without errors': check((ctx) => {
            assert.ok(ctx.response.isOk)
        }),

        'Must return a valid customer': check((ctx) => {
            const customer = ctx.response.ok
            assert.equal(customer.id, '1')
            assert.equal(customer.name, 'Samantha')
            assert.equal(customer.email, 'customer@email.com')
            assert.equal(customer.billingAddress, 'Street 1')
        })

    }),

    'Do not create a new customer when it is invalid': scenario({
        'Given a invalid customer': given({
            request: {
                name: true,
                email: true,
                billingAddress: true
            },
            user: User.fromJSON({ id: '123', permissions: ['CreateCustomer'] }),
            injection: {
                customerRepository: new (class CustomerRepository {
                    async insert(customer) { return (customer) }
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
    herbarium.nodes
        .add('CreateCustomerSpec', createCustomerSpec, herbarium.node.spec)
        .link('CreateCustomer')
        .value