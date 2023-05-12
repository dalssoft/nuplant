const Price = require('../../entities/price')
const findPrice = require('./findPrice')
const assert = require('assert')
const { spec, scenario, given, check } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const findPriceSpec = spec({

    usecase: findPrice,

    'Find a price when it exists': scenario({
        'Given an existing price': given({
            request: {
                id: 'a text'
            },
            user: { hasAccess: true },
            injection: {
                PriceRepository: class PriceRepository {
                    async findByID (id) {
                        const fakePrice = {
                            id: 'a text',
                            price: 99
                        }
                        return ([Price.fromJSON(fakePrice)])
                    }
                }
            }
        }),

        // when: default when for use case

        'Must run without errors': check((ctx) => {
            assert.ok(ctx.response.isOk)
        }),

        'Must return a valid price': check((ctx) => {
            assert.strictEqual(ctx.response.ok.isValid(), true)
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
