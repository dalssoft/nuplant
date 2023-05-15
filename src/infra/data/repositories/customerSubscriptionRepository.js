const { Repository } = require('@herbsjs/herbs2knex')
const { herbarium } = require('@herbsjs/herbarium')
const CustomerSubscription = require('../../../domain/entities/customerSubscription')
const connection = require('../database/connection')

class CustomerSubscriptionRepository extends Repository {
    constructor (injection) {
        super({
            entity: CustomerSubscription,
            table: 'customer_subscriptions',
            knex: connection,
            foreignKeys: [{ customerId: String, subscriptionPlanId: String }],
        })
    }
}

module.exports =
    herbarium.repositories
        .add(CustomerSubscriptionRepository, 'CustomerSubscriptionRepository')
        .metadata({ entity: CustomerSubscription })
        .repository
