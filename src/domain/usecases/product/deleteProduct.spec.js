const Product = require('../../entities/product')
const deleteProduct = require('./deleteProduct')
const assert = require('assert')
const { spec, scenario, given, check } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const deleteProductSpec = spec({

    usecase: deleteProduct,

    'Delete product if exists': scenario({
        'Given an existing product': given({
            request: {
                id: '1'
            },
            user: { hasAccess: true },
            injection: {
                ProductRepository: class ProductRepository {
                    async delete (entity) { return true }
                    async findByID (id) { return [Product.fromJSON({ id })] }
                }
            }
        }),

        // when: default when for use case

        'Must run without errors': check((ctx) => {
            assert.ok(ctx.response.isOk)
        }),

        'Must confirm deletion': check((ctx) => {
            assert.ok(ctx.response.ok === true)
        })

    }),

    'Do not delete product if it does not exist': scenario({
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
      .add(deleteProductSpec, 'DeleteProductSpec')
      .metadata({ usecase: 'DeleteProduct' })
      .spec
