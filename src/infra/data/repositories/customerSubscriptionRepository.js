const { Repository } = require('@herbsjs/herbs2knex')
const { herbarium } = require('@herbsjs/herbarium')
const CustomerSubscription = require('../../../domain/entities/customerSubscription')
const connection = require('../database/connection')

class CustomerSubscriptionRepository extends Repository {
    constructor(injection) {
        super({
            entity: CustomerSubscription,
            table: 'customer_subscriptions',
            knex: connection,
            foreignKeys: [{ customerId: String, subscriptionPlanId: String }]
        })
    }

    async hasActiveSubscription(customer) {
        const customerId = customer.id
        const endDate = new Date()
        const subscription = await this.knex('customer_subscriptions')
            .where('customer_id', customerId)
            .andWhere('end_date', '>', endDate)
            .andWhere('active', true)
            .first()
        return subscription ? true : false
    }
}

module.exports =
    herbarium.nodes
        .add('CustomerSubscriptionRepository', CustomerSubscriptionRepository, herbarium.node.repository)
        .link('CustomerSubscription')
        .value
