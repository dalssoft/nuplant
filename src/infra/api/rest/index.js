const express = require('express')
const { endpoints, routes } = require('@herbsjs/herbs2rest')
const { herbarium } = require('@herbsjs/herbarium')
const controller = require('./controller')

async function rest(app, config) {

    const server = new express.Router()

    herbs2rest({ server, config })

    app.use(server)
}

async function herbs2rest({ server, config }) {
    // Herbs2REST will create Express endpoints
    // based on your use cases and entities.

    // 1. Create endpoints based on the use cases
    endpoints({ herbarium, controller }, {
        'v1': (endpoints) => {
            endpoints.ignore('FindUser')

            endpoints.ignore('SaveBillingCycles')

            endpoints.for('CancelCustomerSubscription').use({
                method: 'PUT',
                path: '/v1/customerSubscriptions/:id/cancel',
                parameters: { params: { id: String } },
            })

            endpoints.for('FindCustomerSubscriptionByCustomer').use({
                method: 'GET',
                path: '/v1/customers/:id/subscription',
                parameters: { params: { id: String } },
            })

            endpoints.for('PayBillingCycle').use({
                method: 'POST',
                path: '/v1/billingCycles/:id/pay',
                parameters: {
                    params: { id: String },
                    body: { paymentProcessorTransactionID: String }
                },
            })

            endpoints.build()
        },
        'v2': (endpoints) => {
            endpoints.ignore('FindUser')
            endpoints.ignore('SaveBillingCycles')
            endpoints.ignore('CancelCustomerSubscription')
            endpoints.ignore('FindCustomerSubscriptionByCustomer')
            endpoints.ignore('PayBillingCycle')
            endpoints.build()
        }
    })

    // 2. Generate the endpoints
    routes({ herbarium, server }).attach()

}

module.exports = { rest }
