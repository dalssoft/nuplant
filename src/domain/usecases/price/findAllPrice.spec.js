const Price = require('../../entities/price')
const User = require('../../entities/user')
const findAllPrice = require('./findAllPrice')
const assert = require('assert').strict
const { spec, scenario, given, check } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const findAllPriceSpec = spec({

    usecase: findAllPrice,

    'Find all prices': scenario({
        'Given an existing prices': given({
            request: { limit: 0, offset: 0, ids: ['1', '2'] },
            user: User.fromJSON({ id: '123', permissions: ['FindAllPrice'] }),
            injection: {
                PriceRepository: class PriceRepository {
                    async find({ limit, offset, where }) {
                        const ids = where.id
                        const fakePrices = [
                            { id: ids[0], price: 10 },
                            { id: ids[1], price: 20 }
                        ]
                        const prices = fakePrices.map(p => Price.fromJSON(p))
                        return (prices)
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
            assert.strictEqual(prices.length, 2)
            assert.strictEqual(prices[0].id, '1')
            assert.strictEqual(prices[0].price, 10)
            assert.strictEqual(prices[1].id, '2')
            assert.strictEqual(prices[1].price, 20)
        })

    })

})

module.exports =
    herbarium.nodes
        .add('FindAllPriceSpec', findAllPriceSpec, herbarium.node.spec)
        .link('FindAllPrice')
        .value