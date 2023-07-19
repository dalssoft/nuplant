const Product = require('../../entities/product')
const User = require('../../entities/user')
const findAllProduct = require('./findAllProduct')
const assert = require('assert').strict
const { spec, scenario, given, check } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const findAllProductSpec = spec({

    usecase: findAllProduct,

    'Find all products': scenario({
        'Given an existing product': given({
            request: { limit: 0, offset: 0 },
            user: User.fromJSON({ id: '123', permissions: ['FindAllProduct'] }),
            injection: {
                ProductRepository: class ProductRepository {
                    async findAll ({ limit, offset }) {
                        const fakeProduct = {
                            id: '1',
                            name: 'A product',
                            description: 'A product description'
                        }
                        return ([Product.fromJSON(fakeProduct)])
                    }
                }
            }
        }),

        // when: default when for use case

        'Must run without errors': check((ctx) => {
            assert.ok(ctx.response.isOk)
        }),

        'Must return a list of products': check((ctx) => {
            const products = ctx.response.ok
            assert.strictEqual(products.length, 1)
            assert.strictEqual(products[0].id, '1')
            assert.strictEqual(products[0].name, 'A product')
            assert.strictEqual(products[0].description, 'A product description')
        })

    })

})

module.exports =
    herbarium.specs
        .add(findAllProductSpec, 'FindAllProductSpec')
        .metadata({ usecase: 'FindAllProduct' })
        .spec
