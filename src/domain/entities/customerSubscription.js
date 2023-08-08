const { entity, id, field } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const { validate } = require('@herbsjs/herbs')
const Customer = require('./customer')
const SubscriptionPlan = require('./subscriptionPlan')

const CustomerSubscription =
    entity('Customer Subscription', {
        id: id(String, { validation: { presence: true } }),
        customer: field(Customer, { validation: { presence: true } }),
        subscriptionPlan: field(SubscriptionPlan, { validation: { presence: true } }),
        startDate: field(Date, { validation: { presence: true } }),
        endDate: field(Date),
        active: field(Boolean, { validation: { presence: true } }),

        validateDates () {
            if (!this.startDate || !this.endDate) return true
            const startDate = validate(this.startDate, { datetime: { before: this.endDate } })
            if (startDate.errors.length) this.errors.startDate = startDate.errors
            return Object.keys(this.errors).length === 0
        },

        isContracted () {
            return this.active && !!this.endDate
        }
    })

module.exports =
    herbarium.nodes
        .add('CustomerSubscription', CustomerSubscription, herbarium.node.entity)
        .value
