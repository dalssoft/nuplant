const Price = require('../../entities/price')
const updatePrice = require('./updatePrice')
const assert = require('assert')
const { spec, scenario, given, check, samples } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const updatePriceSpec = spec({

    usecase: updatePrice,
    'Update a existing price when it is valid': scenario({

        'Valid prices': samples([
            {
                id: 'a text',
                price: 99
            },
            {
                id: 'a text',
                price: 99
            }
        ]),

        'Valid prices Alternative': samples([
            {
                id: 'a text',
                price: 99
            },
            {
                id: 'a text',
                price: 99
            }
        ]),

        'Given a valid price': given((ctx) => ({
            request: ctx.sample,
            user: { hasAccess: true }
        })),

        'Given a repository with a existing price': given((ctx) => ({
            injection: {
                PriceRepository: class PriceRepository {
                    async findByID(id) {
                        const fakePrice = {
                            id: 'a text',
                            price: 99
                        }
                        return ([Price.fromJSON(fakePrice)])
                    }

                    async update(id) { return true }
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

    'Do not update a price when it is invalid': scenario({
        'Given a invalid price': given({
            request: {
                id: true,
                product: true,
                price: true
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

    'Do not update price if it does not exist': scenario({
        'Given an empty price repository': given({
            request: {
                id: 'a text',
                price: 99
            },
            user: { hasAccess: true },
            injection: {
                PriceRepository: class PriceRepository {
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
        .add(updatePriceSpec, 'UpdatePriceSpec')
        .metadata({ usecase: 'UpdatePrice' })
        .spec
