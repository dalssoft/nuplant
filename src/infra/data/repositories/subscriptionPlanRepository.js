const { Repository } = require('@herbsjs/herbs2knex')
const { herbarium } = require('@herbsjs/herbarium')
const SubscriptionPlan = require('../../../domain/entities/subscriptionPlan')
const Price = require('../../../domain/entities/price')
const connection = require('../database/connection')

class SubscriptionPlanRepository extends Repository {
    constructor (injection) {
        super({
            entity: SubscriptionPlan,
            table: 'subscription_plans',
            knex: connection
        })
    }

    async fetchPrices (subscriptionPlans) {
        const subscriptionPlanIds = subscriptionPlans.map(subscriptionPlan => subscriptionPlan.id)

        const prices = await this.knex('subscription_plan_prices')
            .select('subscription_plan_id', 'price_id')
            .whereIn('subscription_plan_id', subscriptionPlanIds)

        // attach all prices to their respective subscription plan
        subscriptionPlans.forEach(subscriptionPlan => {
            subscriptionPlan.prices = prices
                .filter(price => price.subscription_plan_id === subscriptionPlan.id)
                .map(price => Price.fromJSON({ id: price.price_id }))
        })

        return subscriptionPlans
    }

    async insertPrices (subscriptionPlan) {
        const prices = subscriptionPlan.prices
        const subscriptionPlanId = subscriptionPlan.id

        const pricesToInsert = prices.map(price => ({
            subscription_plan_id: subscriptionPlanId,
            price_id: price.id
        }))

        const result = await this.knex('subscription_plan_prices').insert(pricesToInsert).returning('price_id')
        const newPrices = result.map(price => Price.fromJSON({ id: price.price_id }))
        return newPrices
    }

    async deletePrices (subscriptionPlan) {
        const subscriptionPlanId = subscriptionPlan.id

        await this.knex('subscription_plan_prices').where({ subscription_plan_id: subscriptionPlanId }).del()
    }
}

module.exports =
    herbarium.repositories
        .add(SubscriptionPlanRepository, 'SubscriptionPlanRepository')
        .metadata({ entity: SubscriptionPlan })
        .repository
