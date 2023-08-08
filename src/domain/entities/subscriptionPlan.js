const { entity, id, field } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const Price = require('./price')

const SubscriptionPlan =
    entity('Subscription Plan', {
        id: id(String, { validation: { presence: true } }),
        name: field(String, { validation: { presence: true } }),
        description: field(String, { validation: { presence: true } }),
        billingFrequency: field(String, {
            validation: {
                presence: true,
                contains: { allowed: ['w', 'm', 'y'] }
            }
        }),
        prices: field([Price]),
        active: field(Boolean)
    })

module.exports =
    herbarium.nodes
        .add('SubscriptionPlan', SubscriptionPlan, herbarium.node.entity)
        .value
