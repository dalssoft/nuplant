const { entity, id, field } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const Price = require('./price')

const SubscriptionPlan =
    entity('Subscription Plan', {
        id: id(String),
        name: field(String, { validation: { presence: true } }),
        description: field(String, { validation: { presence: true } }),
        billingFrequency: field(String, {
            validation: {
                presence: true,
                contains: { allowed: ['w', 'm', 'y'] }
            }
        }),
        prices: field([Price])
    })

module.exports =
    herbarium.entities
        .add(SubscriptionPlan, 'SubscriptionPlan')
        .entity
