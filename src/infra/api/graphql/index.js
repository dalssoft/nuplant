const { ApolloServer, gql } = require('apollo-server-express')
const { herbs2gql } = require('@herbsjs/herbs2gql')
const { herbarium } = require('@herbsjs/herbarium')
const resolver = require('./resolver')
const CancelCustomerSubscription = require('../../../domain/usecases/customerSubscription/cancelCustomerSubscription')
const FindCustomerSubscriptionByCustomer = require('../../../domain/usecases/customerSubscription//findCustomerSubscriptionByCustomer')

async function graphql(app, config) {
    // Herbs to GraphQL will generate the GraphQL schema and resolvers
    // based on your entities and use cases.

    // 1. Prepare Schema and Resolvers
    // Firts, it will pre-generate all schema for your use cases and entities
    // using the default resolver implementation.
    // Later, you will have the opportunity to customize it.
    const { types, queries, mutations } = herbs2gql({ herbarium, resolver })

    // 2. Add Custom Schema and Resolver
    // Types, Queries, Mutations can receive custom items
    types.push(require('./custom/date'))
    types.push([`input CancelCustomerSubscriptionInput { id: String! }`])
    mutations.push([
        'extend type Mutation { cancelCustomerSubscription (input: CancelCustomerSubscriptionInput): Boolean }',
        { Mutation: { cancelCustomerSubscription: resolver(CancelCustomerSubscription) } }
    ])

    queries.push([
        'extend type Query { findCustomerSubscriptionByCustomer (id: String) : CustomerSubscription }',
        { Query: { findCustomerSubscriptionByCustomer: resolver(FindCustomerSubscriptionByCustomer) } }
    ])

    /* Default Schemas */
    types.unshift([
        `
    type Query {
        _: Boolean
    }
    type Mutation {
        _: Boolean
    }`
    ])

    // 3. Apply Schema and Resolvers to Apollo Server
    const graphQLDef = [].concat(types, queries, mutations)
    const typeDefs = graphQLDef.map((i) => gql(i[0]))
    const resolvers = graphQLDef.map((i) => i[1]).filter((i) => i !== undefined)

    const server = new ApolloServer({
        introspection: true,
        playground: true,
        typeDefs,
        resolvers
        // Authorization
        // context: ({ req }) => ({ user })
    })
    await server.start()
    server.applyMiddleware({ app, path: config.api.graphql.rootPath })

    // eslint-disable-next-line no-console
    console.info(`\n🔗 GraphQL endpoint - ${config.api.graphql.rootPath}`)
}

module.exports = { graphql }
