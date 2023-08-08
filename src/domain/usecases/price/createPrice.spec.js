const createPrice = require('./createPrice')
const User = require('../../entities/user')
const assert = require('assert').strict
const { spec, scenario, given, check } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')
const Product = require('../../entities/product')

const createPriceSpec = spec({

    usecase: createPrice,

    'Create a new price when it is valid': scenario({
        'Given a valid price': given({
            request: {
                price: 99,
                product: Product.fromJSON({ id: '2' })
            },
            user: User.fromJSON({ id: '123', permissions: ['CreatePrice'] }),
            injection: {
                PriceRepository: class PriceRepository {
                    async insert (price) { price.id = '1'; return price }
                }
            }
        }),

        // when: default when for use case

        'Must run without errors': check((ctx) => {
            assert.ok(ctx.response.isOk)
        }),

        'Must return a valid price': check((ctx) => {
            assert.strictEqual(ctx.response.ok.id, '1')
            assert.strictEqual(ctx.response.ok.product.id, '2')
        })

    }),

    'Do not create a new price when it is invalid': scenario({
        'Given a invalid price': given({
            request: {
                price: -1,
                product: Product.fromJSON({ id: '' })
            },
            user: User.fromJSON({ id: '123', permissions: ['CreatePrice'] }),
            injection: {
                priceRepository: new (class PriceRepository {
                    async insert (price) { return (price) }
                })()
            }
        }),

        // when: default when for use case

        'Must return an error': check((ctx) => {
            assert.ok(ctx.response.isErr)
            assert.ok(ctx.response.isInvalidEntityError)
        })

    })
})

module.exports =
    herbarium.nodes
        .add('CreatePriceSpec', createPriceSpec, herbarium.node.spec)
        .link('CreatePrice')
        .value