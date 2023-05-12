const Price = require('../../entities/price')
const findAllPrice = require('./findAllPrice')
const assert = require('assert')
const { spec, scenario, given, check } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const findAllPriceSpec = spec({

    usecase: findAllPrice,

    'Find all prices': scenario({
        'Given an existing price': given({
            request: { limit: 0, offset: 0 },
            user: { hasAccess: true },
            injection: {
                PriceRepository: class PriceRepository {
                    async findAll (id) {
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

        'Must return a list of prices': check((ctx) => {
            assert.strictEqual(ctx.response.ok.length, 1)
        })

    })

})

module.exports =
  herbarium.specs
      .add(findAllPriceSpec, 'FindAllPriceSpec')
      .metadata({ usecase: 'FindAllPrice' })
      .spec
