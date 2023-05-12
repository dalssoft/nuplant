const createPrice = require('./createPrice')
const assert = require('assert')
const { spec, scenario, given, check } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const createPriceSpec = spec({

    usecase: createPrice,

    'Create a new price when it is valid': scenario({
        'Given a valid price': given({
            request: {
                price: 99
            },
            user: { hasAccess: true },
            injection: {
                PriceRepository: class PriceRepository {
                    async insert (price) { return (price) }
                }
            }
        }),

        // when: default when for use case

        'Must run without errors': check((ctx) => {
            assert.ok(ctx.response.isOk)
        }),

        'Must return a valid price': check((ctx) => {
            assert.strictEqual(ctx.response.ok.isValid(), true)
        // TODO: check if it is really a price
        })

    }),

    'Do not create a new price when it is invalid': scenario({
        'Given a invalid price': given({
            request: {
                product: true,
                price: true
            },
            user: { hasAccess: true },
            injection: {
                priceRepository: new (class PriceRepository {
                    async insert (price) { return (price) }
                })()
            }
        }),

        // when: default when for use case

        'Must return an error': check((ctx) => {
            assert.ok(ctx.response.isErr)
        // assert.ok(ret.isInvalidEntityError)
        })

    })
})

module.exports =
  herbarium.specs
      .add(createPriceSpec, 'CreatePriceSpec')
      .metadata({ usecase: 'CreatePrice' })
      .spec
