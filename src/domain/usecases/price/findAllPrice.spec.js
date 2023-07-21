const Price = require('../../entities/price')
const User = require('../../entities/user')
const findAllPrice = require('./findAllPrice')
const assert = require('assert').strict
const { spec, scenario, given, check } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const findAllPriceSpec = spec({

    usecase: findAllPrice,

    'Find all prices': scenario({
        'Given an existing price': given({
            request: { limit: 0, offset: 0 },
            user: User.fromJSON({ id: '123', permissions: ['FindAllPrice'] }),
            injection: {
                PriceRepository: class PriceRepository {
                    async findAll ({ limit, offset }) {
                        const fakePrice = {
                            id: '1',
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

        'Must return a list of prices': check((ctx) => {
            const prices = ctx.response.ok
            assert.strictEqual(prices.length, 1)
            assert.strictEqual(prices[0].id, '1')
            assert.strictEqual(prices[0].product.id, '2')
        })

    })

})

module.exports =
    herbarium.specs
        .add(findAllPriceSpec, 'FindAllPriceSpec')
        .metadata({ usecase: 'FindAllPrice' })
        .spec
