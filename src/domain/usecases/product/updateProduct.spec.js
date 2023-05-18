const Product = require('../../entities/product')
const updateProduct = require('./updateProduct')
const assert = require('assert').strict
const { spec, scenario, given, check, samples } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const updateProductSpec = spec({

    usecase: updateProduct,
    'Update a existing product when it is valid': scenario({

        'Valid products': samples([
            {
                id: '1',
                name: 'A product',
                description: 'A product description'
            }
        ]),

        'Given a valid product': given((ctx) => ({
            request: ctx.sample,
            user: { hasAccess: true }
        })),

        'Given a repository with a existing product': given((ctx) => ({
            injection: {
                ProductRepository: class ProductRepository {
                    async findByID (id) {
                        const fakeProduct = {
                            id,
                            name: 'A product',
                            description: 'A product description'
                        }
                        return ([Product.fromJSON(fakeProduct)])
                    }

                    async update (id) { return true }
                }
            }
        })),

        // when: default when for use case

        'Must run without errors': check((ctx) => {
            assert.ok(ctx.response.isOk)
        }),

        'Must confirm update': check((ctx) => {
            assert.ok(ctx.response.ok === true)
        })

    }),

    'Do not update a product when it is invalid': scenario({
        'Given a invalid product': given({
            request: {
                id: '1',
                name: '',
                description: ''
            },
            user: { hasAccess: true },
            injection: {
                ProductRepository: class ProductRepository {
                    async findByID (id) {
                        const fakeProduct = {
                            id,
                            name: 'A product',
                            description: 'A product description'
                        }
                        return ([Product.fromJSON(fakeProduct)])
                    }
                }
            }
        }),

        // when: default when for use case

        'Must return an error': check((ctx) => {
            assert.ok(ctx.response.isErr)
            assert.ok(ctx.response.isInvalidEntityError)
        })

    }),

    'Do not update product if it does not exist': scenario({
        'Given an empty product repository': given({
            request: {
                id: '1',
                name: 'A product',
                description: 'A product description'
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
        .add(updateProductSpec, 'UpdateProductSpec')
        .metadata({ usecase: 'UpdateProduct' })
        .spec
