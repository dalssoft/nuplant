const { usecase, step, Ok, Err } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const User = require('../../entities/user')
const UserRepository = require('../../../infra/data/repositories/userRepository')

const dependency = { UserRepository }

const findUser = injection =>
  usecase('Find  User', {
    // Input/Request metadata and validation 
    request: {
      id: String
    },

    // Output/Response metadata
    response: User,

    authorize: () => Ok(),

    setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

    'Find and return the User': step(async ctx => {
      const id = ctx.req.id
      const repo = new ctx.di.UserRepository(injection)
      let [user] = await repo.findByID(id)
      user ??= User.fromJSON({ id: id })
      return Ok(ctx.ret = user)
    })
  })

module.exports =
  herbarium.nodes
    .add('FindUser', findUser, herbarium.node.usecase)
    .link('User')
    .value