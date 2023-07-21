const Customer = require('../../entities/customer')
const User = require('../../entities/user')
const updateCustomer = require('./updateCustomer')
const assert = require('assert').strict
const { spec, scenario, given, check, samples } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const updateCustomerSpec = spec({

    usecase: updateCustomer,
    'Update a existing customer when it is valid': scenario({

        'Valid customers': samples([
            {
                id: '1',
                name: 'Samantha',
                email: 'customer@email.com',
                billingAddress: 'Street 1'
            }
        ]),

        'Given a valid customer': given((ctx) => ({
            request: ctx.sample,
            user: User.fromJSON({ id: '123', permissions: ['UpdateCustomer'] }),
        })),

        'Given a repository with a existing customer': given((ctx) => ({
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

    'Do not update a customer when it is invalid': scenario({
        'Given a invalid customer': given({
            request: {
                id: true,
                name: true,
                email: true,
                billingAddress: true
            },
            user: User.fromJSON({ id: '123', permissions: ['UpdateCustomer'] }),
            injection: {}
        }),

        // when: default when for use case

        'Must return an error': check((ctx) => {
            assert.ok(ctx.response.isErr)
            // assert.ok(ctx.response.isInvalidEntityError)
        })

    }),

    'Do not update customer if it does not exist': scenario({
        'Given an empty customer repository': given({
            request: {
                id: '1',
                name: 'Samantha',
                email: 'customer@email.com',
                billingAddress: 'Street 1'
            },
            user: User.fromJSON({ id: '123', permissions: ['UpdateCustomer'] }),
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
        .add(updateCustomerSpec, 'UpdateCustomerSpec')
        .metadata({ usecase: 'UpdateCustomer' })
        .spec
