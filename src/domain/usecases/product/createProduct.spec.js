const createProduct = require('./createProduct')
const assert = require('assert')
const { spec, scenario, given, check } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const createProductSpec = spec({

    usecase: createProduct,

    'Create a new product when it is valid': scenario({
        'Given a valid product': given({
            request: {
                name: 'A product',
                description: 'A product description'
            },
            user: { hasAccess: true },
            injection: {
                ProductRepository: class ProductRepository {
                    async insert (product) { return (product) }
                }
            }
        }),

        // when: default when for use case

        'Must run without errors': check((ctx) => {
            assert.ok(ctx.response.isOk)
        }),

        'Must return a valid product': check((ctx) => {
            assert.strictEqual(ctx.response.ok.isValid(), true)
            assert.strictEqual(ctx.response.ok.name, 'A product')
            assert.strictEqual(ctx.response.ok.description, 'A product description')
        })

    }),

    'Do not create a new product when it is invalid': scenario({
        'Given a invalid product': given({
            request: {
                name: true,
                description: true
            },
            user: { hasAccess: true },
            injection: {
                productRepository: new (class ProductRepository {
                    async insert (product) { return (product) }
                })()
            }
        }),

        // when: default when for use case

        'Must return an error': check((ctx) => {
            assert.ok(ctx.response.isErr)
        })

    })
})

module.exports =
    herbarium.specs
        .add(createProductSpec, 'CreateProductSpec')
        .metadata({ usecase: 'CreateProduct' })
        .spec
