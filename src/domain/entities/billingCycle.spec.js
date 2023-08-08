const { spec, scenario, given, check, when, samples } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')
const BillingCycle = require('./billingCycle')
const assert = require('assert').strict
const { DateTime } = require('luxon')

function toDate(isoDate) {
    return DateTime.fromISO(isoDate).toJSDate()
}

const billingCycleSpec = spec({

    'Calculate the End Date for Weekly, Monthly and Yearly Billing Frequency': scenario({
        'Billing Frequencies Weekly': samples([
            {
                given: { billingFrequency: 'w', startDate: new Date('2020-01-01'), endDate: new Date('2021-01-01') },
                expected: { endDate: new Date('2020-01-07') }
            },
            {
                given: { billingFrequency: 'w', startDate: new Date('2020-06-01'), endDate: new Date('2021-06-01') },
                expected: { endDate: new Date('2020-06-07') }
            },
        ]),

        'Billing Frequencies Monthly': samples([
            // firt month, first day
            {
                given: { billingFrequency: 'm', startDate: toDate('2020-01-01'), endDate: toDate('2021-01-01') },
                expected: { endDate: toDate('2020-01-31') }
            },
            // month with 30 days
            {
                given: { billingFrequency: 'm', startDate: toDate('2020-06-01'), endDate: toDate('2021-06-01') },
                expected: { endDate: toDate('2020-06-30') }
            },
            // middle month
            {
                given: { billingFrequency: 'm', startDate: toDate('2020-02-15'), endDate: toDate('2021-02-15') },
                expected: { endDate: toDate('2020-03-14') }
            },
        ]),

        'Billing Frequencies Yearly': samples([
            // firt month, first day
            {
                given: { billingFrequency: 'y', startDate: toDate('2020-01-01'), endDate: toDate('2025-01-01') },
                expected: { endDate: toDate('2020-12-31') }
            },
        ]),

        'Given a valid initial Billing Cycle': given(ctx => (ctx.billingCycle =
            BillingCycle.fromJSON({
                id: '1',
                customerSubscription: {
                    id: '1',
                    customer: { id: '1' },
                    subscriptionPlan: {
                        id: '1',
                        billingFrequency: ctx.sample.given.billingFrequency,
                        prices: [
                            { id: '1', product: { id: '1' }, price: 1 },
                            { id: '2', product: { id: '2' }, price: 2 }
                        ]
                    },
                    startDate: ctx.sample.given.startDate,
                    endDate: ctx.sample.given.endDate,
                    active: true
                },
                startDate: ctx.sample.given.startDate,
            }))),

        'When calculate the end date': when(ctx => {
            ctx.billingCycle.calculateEndDate()
        }),

        'Must return the end date': check(ctx => {
            assert.deepEqual(ctx.billingCycle.endDate, ctx.sample.expected.endDate)
        })

    }),

    'Calculate the Amount Due': scenario({
        'Given a valid initial Billing Cycle': given(ctx => (ctx.billingCycle = BillingCycle.fromJSON({
            id: '1',
            customerSubscription: {
                id: '1',
                customer: { id: '1' },
                subscriptionPlan: {
                    id: '1',
                    billingFrequency: 'm',
                    prices: [
                        { id: '1', product: { id: '1' }, price: 1 },
                        { id: '2', product: { id: '2' }, price: 2 }
                    ]
                },
                startDate: new Date('2020-01-01'),
                endDate: new Date('2021-01-01'),
                active: true
            },
            startDate: new Date('2020-01-01'),
            endDate: new Date('2020-01-31'),
        }))),

        'When calculate the amount due': when(ctx => {
            ctx.billingCycle.calculateAmountDue()
        }),

        'Must return the amount due': check(ctx => {
            assert.deepEqual(ctx.billingCycle.amountDue, 3)
        })

    }),

    'Initial the First Billing Cycle': scenario({
        'Given a valid initial Billing Cycle': given(ctx => (ctx.billingCycle = BillingCycle.fromJSON({
            id: '1',
            customerSubscription: {
                id: '1',
                customer: { id: '1' },
                subscriptionPlan: {
                    id: '1',
                    billingFrequency: 'm',
                    prices: [
                        { id: '1', product: { id: '1' }, price: 1 },
                        { id: '2', product: { id: '2' }, price: 2 }
                    ]
                },
                startDate: new Date('2020-01-01'),
                endDate: new Date('2021-01-01'),
                active: true
            },
        }))),

        'When initialize the first billing cycle': when(ctx => {
            ctx.billingCycle.initializeAsFirst()
        }),
        'Must return the first billing cycle': check(ctx => {
            assert.deepEqual(ctx.billingCycle.startDate, new Date('2020-01-01'))
            assert.deepEqual(ctx.billingCycle.endDate, new Date('2020-01-31'))
            assert.deepEqual(ctx.billingCycle.amountDue, 3)
        })
    }),

    'Create Next Billing Cycle': scenario({

        'Subscriptions': samples([
            {
                given: {
                    customerSubscription: { startDate: new Date('2020-01-01'), endDate: new Date('2021-01-01'), billingFrequency: 'w' },
                },
                expected: { startDate: new Date('2020-01-08'), endDate: new Date('2020-01-14') }
            },
            {
                given: {
                    customerSubscription: { startDate: new Date('2020-01-01'), endDate: new Date('2021-01-01'), billingFrequency: 'm' },
                },
                expected: { startDate: new Date('2020-02-01'), endDate: new Date('2020-02-29') }
            },
            {
                given: {
                    customerSubscription: { startDate: new Date('2020-01-01'), endDate: new Date('2024-12-31'), billingFrequency: 'y' },
                },
                expected: { startDate: new Date('2021-01-01'), endDate: new Date('2021-12-31') }
            },
        ]),

        'Given a valid initial Billing Cycle': given(ctx => (ctx.billingCycle = BillingCycle.fromJSON({
            id: '1',
            customerSubscription: {
                id: '1',
                customer: { id: '1' },
                subscriptionPlan: {
                    id: '1',
                    billingFrequency: ctx.sample.given.customerSubscription.billingFrequency,
                    prices: [
                        { id: '1', product: { id: '1' }, price: 1 },
                        { id: '2', product: { id: '2' }, price: 2 }
                    ]
                },
                startDate: ctx.sample.given.customerSubscription.startDate,
                endDate: ctx.sample.given.customerSubscription.endDate,
                active: true
            },
        }))),

        'When create the next billing cycle': when(ctx => {
            ctx.billingCycle.initializeAsFirst()
            ctx.nextBillingCycle = ctx.billingCycle.createNext()
        }),

        'Must return the next billing cycle': check(ctx => {
            assert.deepEqual(ctx.nextBillingCycle.startDate, ctx.sample.expected.startDate)
            assert.deepEqual(ctx.nextBillingCycle.endDate, ctx.sample.expected.endDate)
            assert.deepEqual(ctx.nextBillingCycle.amountDue, 3)
        })
    }),

    'Do not Create Next Billing Cycle if the current is the last': scenario({
        'Given a last Billing Cycle': given(ctx => (ctx.billingCycle = BillingCycle.fromJSON({
            id: '1',
            customerSubscription: {
                id: '1',
                customer: { id: '1' },
                subscriptionPlan: {
                    id: '1',
                    billingFrequency: 'm',
                    prices: [
                        { id: '1', product: { id: '1' }, price: 1 },
                        { id: '2', product: { id: '2' }, price: 2 }
                    ]
                },
                startDate: new Date('2020-01-01'),
                endDate: new Date('2020-12-31'),
                active: true
            },
            startDate: new Date('2020-12-01'),
            endDate: new Date('2020-12-31'),
        }))),

        'When create the next billing cycle': when(ctx => {
            ctx.nextBillingCycle = ctx.billingCycle.createNext()
        }),

        'Must return null': check(ctx => {
            assert.deepEqual(ctx.nextBillingCycle, null)
        })
    })
})

module.exports =
    herbarium.nodes
        .add('BillingCycleSpec', billingCycleSpec, herbarium.node.spec)
        .link('BillingCycle')
        .value