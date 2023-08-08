const Customer = require('../../entities/customer')
const User = require('../../entities/user')
const SubscriptionPlan = require('../../entities/subscriptionPlan')
const Price = require('../../entities/price')
const createCustomerSubscription = require('./createCustomerSubscription')
const assert = require('assert').strict
const { spec, scenario, given, check } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')
const { usecase, step, Ok } = require('@herbsjs/herbs')
const { DateTime } = require("luxon")

const createCustomerSubscriptionSpec = spec({

    usecase: createCustomerSubscription,

    'Create a new Customer Subscription with determined end date (Contracted)': scenario({
        'Given a valid Customer Subscription': given({
            request: {
                customer: Customer.fromJSON({ id: '1234' }),
                subscriptionPlan: SubscriptionPlan.fromJSON({ id: '5678' }),
                startDate: DateTime.fromISO('2020-01-01').toJSDate(),
                endDate: DateTime.fromISO('2020-12-31').toJSDate(),
                active: true
            },
            user: User.fromJSON({ id: 'abc', permissions: ['CreateCustomerSubscription', 'FindSubscriptionPlan', 'FindAllPrice', 'SaveBillingCycles'] }),
            injection: {
                CustomerSubscriptionRepository: class CustomerSubscriptionRepository {
                    async insert(customerSubscription) { customerSubscription.id = '90123'; return (customerSubscription) }
                    async hasActiveSubscription(customerId) { return false }
                },
                FindSubscriptionPlan: (injection) => usecase('Find Subscription Plan', {
                    request: { id: String },
                    authorize: () => Ok(),
                    'Find Subscription Plan': step((ctx) => ctx.ret =
                        SubscriptionPlan.fromJSON({
                            id: ctx.req.id,
                            name: 'Plan 1',
                            description: 'Plan 1',
                            billingFrequency: 'm',
                            prices: [{ id: '123' }, { id: '456' }]
                        })
                    )
                }),
                FindAllPrice: (injection) => usecase('Find all Prices', {
                    request: { ids: Array },
                    authorize: () => Ok(),
                    'Find all Prices': step((ctx) => ctx.ret = [
                        Price.fromJSON({ id: ctx.req.ids[0], price: 10 }),
                        Price.fromJSON({ id: ctx.req.ids[1], price: 20 })
                    ])
                }),
                SaveBillingCycles: (injection) => usecase('Save Billing Cycles', {
                    request: { billingCycles: [Object] },
                    authorize: (user) => Ok(),
                    'Save Billing Cycles': step((ctx) => {
                        const billingCycles = ctx.req.billingCycles
                        const customerSubscription = billingCycles[0].customerSubscription
                        customerSubscription.billingCycles = billingCycles
                        ctx.ret = billingCycles
                    })
                })
            }
        }),

        // when: default when for use case

        'Must run without errors': check((ctx) => {
            assert.ok(ctx.response.isOk)
        }),

        'Must return a valid Customer Subscription': check((ctx) => {
            const customerSubscription = ctx.response.ok
            assert.equal(customerSubscription.id, '90123')
            assert.equal(customerSubscription.customer.id, '1234')
            assert.equal(customerSubscription.subscriptionPlan.id, '5678')
            assert.equal(customerSubscription.startDate.getTime(), DateTime.fromISO('2020-01-01').toJSDate().getTime())
            assert.equal(customerSubscription.endDate.getTime(), DateTime.fromISO('2020-12-31').toJSDate().getTime())
            assert.equal(customerSubscription.active, true)
        }),

        'Must return a valid Billing Cycles': check((ctx) => {
            const customerSubscription = ctx.response.ok
            assert.equal(customerSubscription.billingCycles.length, 12)
            assert.equal(customerSubscription.billingCycles[0].startDate.getTime(), DateTime.fromISO('2020-01-01').toJSDate().getTime())
            assert.equal(customerSubscription.billingCycles[0].endDate.getTime(), DateTime.fromISO('2020-01-31').toJSDate().getTime())
            assert.equal(customerSubscription.billingCycles[0].amountDue, 30)
            assert.equal(customerSubscription.billingCycles[0].paymentStatus, 'pending')
            assert.equal(customerSubscription.billingCycles[11].startDate.getTime(), DateTime.fromISO('2020-12-01').toJSDate().getTime())
            assert.equal(customerSubscription.billingCycles[11].endDate.getTime(), DateTime.fromISO('2020-12-31').toJSDate().getTime())
            assert.equal(customerSubscription.billingCycles[11].amountDue, 30)
            assert.equal(customerSubscription.billingCycles[11].paymentStatus, 'pending')
        })
    }),

    'Create a new Customer Subscription with no determined end date': scenario({
        'Given a valid Customer Subscription': given({
            request: {
                customer: Customer.fromJSON({ id: '1' }),
                subscriptionPlan: SubscriptionPlan.fromJSON({ id: '1' }),
                startDate: new Date('2020-01-01'),
                active: true
            },
            user: User.fromJSON({ id: '123', permissions: ['CreateCustomerSubscription'] }),
            injection: {
                CustomerSubscriptionRepository: class CustomerSubscriptionRepository {
                    async insert(customerSubscription) { customerSubscription.id = '1'; return (customerSubscription) }
                    async hasActiveSubscription(customerId) { return false }
                }
            }
        }),

        // when: default when for use case

        'Must run without errors': check((ctx) => {
            assert.ok(ctx.response.isOk)
        }),

        'Must return a valid Customer Subscription': check((ctx) => {
            const customerSubscription = ctx.response.ok
            assert.equal(customerSubscription.id, '1')
            assert.equal(customerSubscription.customer.id, '1')
            assert.equal(customerSubscription.subscriptionPlan.id, '1')
            assert.equal(customerSubscription.startDate.getTime(), new Date('2020-01-01').getTime())
            assert.equal(customerSubscription.endDate, undefined)
            assert.equal(customerSubscription.active, true)
        })
    }),

    'Do not create a new Customer Subscription when it is invalid': scenario({
        'Given a invalid Customer Subscription': given({
            request: {
                customer: Customer.fromJSON({}),
                subscriptionPlan: SubscriptionPlan.fromJSON({}),
                startDate: new Date('2020-01-01'),
                endDate: new Date('2020-01-01'),
                active: true
            },
            user: User.fromJSON({ id: '123', permissions: ['CreateCustomerSubscription'] }),
            injection: {}
        }),

        // when: default when for use case

        'Must return an error': check((ctx) => {
            assert.ok(ctx.response.isErr)
            assert.ok(ctx.response.isInvalidEntityError)
        })

    }),

    'Do not create a new Customer Subscription when start date is greater than end date': scenario({
        'Given a invalid Customer Subscription': given({
            request: {
                customer: Customer.fromJSON({ id: '1' }),
                subscriptionPlan: SubscriptionPlan.fromJSON({ id: '1' }),
                startDate: new Date('2020-02-01'),
                endDate: new Date('2020-01-01'),
                active: true
            },
            user: User.fromJSON({ id: '123', permissions: ['CreateCustomerSubscription'] }),
            injection: {}
        }),

        // when: default when for use case

        'Must return an error': check((ctx) => {
            assert.ok(ctx.response.isErr)
            assert.ok(ctx.response.isInvalidEntityError)
            assert.ok(ctx.response.err.cause.startDate[0].tooLate)
        })

    }),

    'Do not create a new Customer Subscription if Customer already has an active subscription': scenario({
        'Given a active Customer Subscription': given({
            request: {
                customer: Customer.fromJSON({ id: '1' }),
                subscriptionPlan: SubscriptionPlan.fromJSON({ id: '1' }),
                startDate: new Date('2020-01-01'),
                endDate: new Date('2020-01-02'),
                active: true
            },
            user: User.fromJSON({ id: '123', permissions: ['CreateCustomerSubscription'] }),
            injection: {
                CustomerSubscriptionRepository: class CustomerSubscriptionRepository {
                    async hasActiveSubscription(customerId) { return true }
                }
            }
        }),

        // when: default when for use case

        'Must return an error': check((ctx) => {
            assert.ok(ctx.response.isErr)
            assert.equal(ctx.response.err.message, 'The Customer already has a Subscription')
        })
    }),
})

module.exports =
    herbarium.nodes
        .add('CreateCustomerSubscriptionSpec', createCustomerSubscriptionSpec, herbarium.node.spec)
        .link('CreateCustomerSubscription')
        .value