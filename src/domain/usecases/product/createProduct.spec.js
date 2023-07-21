const createProduct = require('./createProduct')
const User = require('../../entities/user')
const assert = require('assert').strict
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
            user: User.fromJSON({ id: '123', permissions: ['CreateProduct'] }),
            injection: {
                ProductRepository: class ProductRepository {
                    async insert (product) { product.id = '1'; return product }
                }
            }
        }),

        // when: default when for use case

        'Must run without errors': check((ctx) => {
            assert.ok(ctx.response.isOk)
        }),

        'Must return a valid product': check((ctx) => {
            assert.strictEqual(ctx.response.ok.isValid(), true)
            assert.strictEqual(ctx.response.ok.id, '1')
            assert.strictEqual(ctx.response.ok.name, 'A product')
            assert.strictEqual(ctx.response.ok.description, 'A product description')
        })

    }),

    'Do not create a new product when it is invalid': scenario({
        'Given a invalid product': given({
            request: {
                name: '',
                description: ''
            },
            user: User.fromJSON({ id: '123', permissions: ['CreateProduct'] }),
            injection: {
                productRepository: new (class ProductRepository {
                    async insert (product) { return (product) }
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
    herbarium.specs
        .add(createProductSpec, 'CreateProductSpec')
        .metadata({ usecase: 'CreateProduct' })
        .spec
