const User = require('../../entities/user')
const findUser = require('./findUser')
const assert = require('assert').strict
const { spec, scenario, given, check } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const findUserSpec = spec({

  usecase: findUser,

  'Find a user when user exists': scenario({
    'Given an existing user': given({
      request: {
        id: '123'
      },
      user: {},
      injection: {
        UserRepository: class UserRepository {
          async findByID(userId) {
            const fakeUser = {
              id: 'abc',
              permissions: ['Create', 'Update']
            }
            return ([User.fromJSON(fakeUser)])
          }
        }
      },
    }),

    // when: default when for use case

    'Must run without errors': check((ctx) => {
      assert.ok(ctx.response.isOk)
    }),

    'Must return a valid user': check((ctx) => {
      assert.equal(ctx.response.ok.isValid(), true)
      assert.equal(ctx.response.ok.id, 'abc')
      assert.deepEqual(ctx.response.ok.permissions, ['Create', 'Update'])
    })

  }),

  'Do not find a user when user does not exist': scenario({
    'Given an non existing user': given({
      request: {
        id: '123'
      },
      user: { hasAccess: true },
      injection: {
        UserRepository: class UserRepository {
          async findByID(userId) {
            return ([])
          }
        }
      },
    }),

    // when: default when for use case

    'Must return an error': check((ctx) => {
      assert.ok(ctx.response.isErr)
      assert.ok(ctx.response.isNotFoundError)
    }),
  }),
})

module.exports =
  herbarium.specs
    .add(findUserSpec, 'FindUserSpec')
    .metadata({ usecase: 'FindUser' })
    .spec