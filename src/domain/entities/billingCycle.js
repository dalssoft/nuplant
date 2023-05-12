const { entity, id, field } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const CustomerSubscription = require('./customerSubscription')

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
            }
        }),
        paymentProcessorTransactionID: field(String, { validation: { presence: false } }),
        paymentDate: field(Date, { validation: { presence: false } })
    })

module.exports =
    herbarium.entities
        .add(BillingCycle, 'BillingCycle')
        .entity
