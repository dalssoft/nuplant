const { spec, scenario, given, check, when } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')
const CustomerSubscription = require('./customerSubscription')
const Customer = require('./customer')
const SubscriptionPlan = require('./subscriptionPlan')
const assert = require('assert').strict

const customerSubscriptionSpec = spec({

    'A Customer Subscription with valid start and end date': scenario({
        'Given a valid Customer Subscription': given(ctx => (ctx.customerSubscription = CustomerSubscription.fromJSON({
            id: '1',
            customer: Customer.fromJSON({ id: '1' }),
            subscriptionPlan: SubscriptionPlan.fromJSON({ id: '1' }),
            startDate: new Date('2020-01-01'),
            endDate: new Date('2020-01-02'),
            active: true
        }))),

        'When validate dates': when(ctx => {
            ctx.customerSubscription.validate({ references: { onlyIDs: true } })
            ctx.customerSubscription.validateDates()
        }),

        'Must return no errors': check(ctx => {
            assert.deepEqual(ctx.customerSubscription.errors, {})
        })
    }),

    'A Customer Subscription with start date after end date': scenario({
        'Given a valid Customer Subscription': given(ctx => (ctx.customerSubscription = CustomerSubscription.fromJSON({
            id: '1',
            customer: Customer.fromJSON({ id: '1' }),
            subscriptionPlan: SubscriptionPlan.fromJSON({ id: '1' }),
            startDate: new Date('2020-02-01'),
            endDate: new Date('2020-01-01'),
            active: true
        }))),

        'When validate dates': when(ctx => {
            ctx.customerSubscription.validate({ references: { onlyIDs: true } })
            ctx.customerSubscription.validateDates()
        }),

        'Must return no errors': check(ctx => {
            assert.deepEqual(ctx.customerSubscription.errors, { startDate: [{ tooLate: new Date('2020-01-01') }] })
        })
    })

})

module.exports =
    herbarium.specs
        .add(customerSubscriptionSpec, 'CustomerSubscription')
        .metadata({ entity: 'CustomerSubscription' })
        .spec