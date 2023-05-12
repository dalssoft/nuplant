const { entity, id, field } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const Customer = require('./customer')
const SubscriptionPlan = require('./subscriptionPlan')

const CustomerSubscription =
    entity('Customer Subscription', {
        id: id(String),
        customer: field(Customer, { validation: { presence: true } }),
        subscriptionPlan: field(SubscriptionPlan, { validation: { presence: true } }),
        startDate: field(Date, { validation: { presence: true } }),
        endDate: field(Date, { validation: { presence: true } }),
        active: field(Boolean, { validation: { presence: true } })
    })

module.exports =
    herbarium.entities
        .add(CustomerSubscription, 'CustomerSubscription')
        .entity
