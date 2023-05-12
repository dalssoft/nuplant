const Product = require('../../entities/product')
const findAllProduct = require('./findAllProduct')
const assert = require('assert')
const { spec, scenario, given, check } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const findAllProductSpec = spec({

    usecase: findAllProduct,

    'Find all products': scenario({
        'Given an existing product': given({
            request: { limit: 0, offset: 0 },
            user: { hasAccess: true },
            injection: {
                ProductRepository: class ProductRepository {
                    async findAll (id) {
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
            assert.strictEqual(ctx.response.ok.length, 1)
        })

    })

})

module.exports =
    herbarium.specs
        .add(findAllProductSpec, 'FindAllProductSpec')
        .metadata({ usecase: 'FindAllProduct' })
        .spec
