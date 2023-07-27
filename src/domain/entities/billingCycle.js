const { entity, id, field } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const CustomerSubscription = require('./customerSubscription')
const { v4: uuidv4 } = require('uuid')
const { DateTime } = require("luxon")

const BillingCycle =
    entity('Billing Cycle', {
        id: id(String),
        customerSubscription: field(CustomerSubscription, { validation: { presence: true } }),
        startDate: field(Date, { validation: { presence: true } }),
        endDate: field(Date, { validation: { presence: true } }),
        amountDue: field(Number, { validation: { presence: true, numericality: { greaterThanOrEqualTo: 0 } } }),
        paymentStatus: field(String, {
            validation: {
                presence: true,
                contains: { allowed: ['pending', 'paid', 'failed'] }
            },
            default: () => 'pending'
        }),
        paymentProcessorTransactionID: field(String, { validation: { presence: false } }),
        paymentDate: field(Date, { validation: { presence: false } }),

        initializeAsFirst() {
            this.startDate = this.customerSubscription.startDate
            this.calculateEndDate()
            this.calculateAmountDue()
        },

        createNext() {
            const endCustomerSubscriptionDate = this.customerSubscription.endDate
            if (endCustomerSubscriptionDate && this.endDate >= endCustomerSubscriptionDate) return null
            const startDate = DateTime.fromJSDate(this.endDate).plus({ days: 1 }).toJSDate()
            const nextBillingCycle = BillingCycle.fromJSON({
                customerSubscription: this.customerSubscription,
                startDate: startDate,
                amountDue: this.amountDue
            })
            nextBillingCycle.calculateEndDate()
            return nextBillingCycle
        },

        calculateAmountDue() {
            const prices = this.customerSubscription?.subscriptionPlan?.prices
            if (!prices) throw new Error('Billing Cycle must have a Subscription Plan with Prices to calculate Amount Due')
            const totalAmount = prices.reduce((total, price) => total + price.price, 0)
            this.amountDue = totalAmount
        },

        calculateEndDate() {
            const frequency = this.customerSubscription?.subscriptionPlan?.billingFrequency
            const startDate = this.startDate
            if (!startDate) throw new Error('Billing Cycle must have a Start Date to calculate End Date')
            if (!frequency) throw new Error('Billing Cycle must have a Billing Frequency to calculate End Date')

            let endDate = DateTime.fromJSDate(startDate)
            if (frequency === 'w') endDate = endDate.plus({ weeks: 1 })
            if (frequency === 'm') endDate = endDate.plus({ months: 1 })
            if (frequency === 'y') endDate = endDate.plus({ years: 1 })
            endDate = endDate.minus({ days: 1 })

            this.endDate = endDate.toJSDate()
        },
    })

module.exports =
    herbarium.entities
        .add(BillingCycle, 'BillingCycle')
        .entity
