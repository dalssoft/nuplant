const Price = require('../../entities/price')
const findPrice = require('./findPrice')
const assert = require('assert').strict
const { spec, scenario, given, check } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const findPriceSpec = spec({

    usecase: findPrice,

    'Find a price when it exists': scenario({
        'Given an existing price': given({
            request: {
                id: '1'
            },
            user: { hasAccess: true },
            injection: {
                PriceRepository: class PriceRepository {
                    async findByID (id) {
                        const fakePrice = {
                            id,
                            price: 99
                        }
                        const price = Price.fromJSON(fakePrice)
                        price.productId = '2'
                        return ([price])
                    }
                }
            }
        }),

        // when: default when for use case

        'Must run without errors': check((ctx) => {
            assert.ok(ctx.response.isOk)
        }),

        'Must return a valid price': check((ctx) => {
            const price = ctx.response.ok
            assert.strictEqual(price.id, '1')
            assert.strictEqual(price.product.id, '2')
        })

    }),

    'Do not find a price when it does not exist': scenario({
        'Given an empty price repository': given({
            request: {
                id: 'a text'
            },
            user: { hasAccess: true },
            injection: {
                PriceRepository: class PriceRepository {
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
        .add(findPriceSpec, 'FindPriceSpec')
        .metadata({ usecase: 'FindPrice' })
        .spec
