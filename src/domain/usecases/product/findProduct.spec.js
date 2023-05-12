const Product = require('../../entities/product')
const findProduct = require('./findProduct')
const assert = require('assert')
const { spec, scenario, given, check } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const findProductSpec = spec({

    usecase: findProduct,

    'Find a product when it exists': scenario({
        'Given an existing product': given({
            request: {
                id: 'a text'
            },
            user: { hasAccess: true },
            injection: {
                ProductRepository: class ProductRepository {
                    async findByID (id) {
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

        'Must return a valid product': check((ctx) => {
            assert.strictEqual(ctx.response.ok.isValid(), true)
        })

    }),

    'Do not find a product when it does not exist': scenario({
        'Given an empty product repository': given({
            request: {
                id: 'a text'
            },
            user: { hasAccess: true },
            injection: {
                ProductRepository: class ProductRepository {
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
        .add(findProductSpec, 'FindProductSpec')
        .metadata({ usecase: 'FindProduct' })
        .spec
