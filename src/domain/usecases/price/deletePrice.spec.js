const Price = require('../../entities/price')
const User = require('../../entities/user')
const deletePrice = require('./deletePrice')
const assert = require('assert').strict
const { spec, scenario, given, check } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const deletePriceSpec = spec({

    usecase: deletePrice,

    'Delete price if exists': scenario({
        'Given an existing price': given({
            request: {
                id: 'a text'
            },
            user: User.fromJSON({ id: '123', permissions: ['DeletePrice'] }),
            injection: {
                PriceRepository: class PriceRepository {
                    async delete (entity) { return true }
                    async findByID (id) { return [Price.fromJSON({ id })] }
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

    'Do not delete price if it does not exist': scenario({
        'Given an empty price repository': given({
            request: {
                id: '1'
            },
            user: User.fromJSON({ id: '123', permissions: ['DeletePrice'] }),
            injection: {
                PriceRepository: class PriceRepository {
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
      .add(deletePriceSpec, 'DeletePriceSpec')
      .metadata({ usecase: 'DeletePrice' })
      .spec
