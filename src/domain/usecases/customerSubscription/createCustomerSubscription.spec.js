const Customer = require('../../entities/customer')
const SubscriptionPlan = require('../../entities/subscriptionPlan')
const createCustomerSubscription = require('./createCustomerSubscription')
const assert = require('assert').strict
const { spec, scenario, given, check } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const createCustomerSubscriptionSpec = spec({

    usecase: createCustomerSubscription,

    'Create a new Customer Subscription when it is valid': scenario({
        'Given a valid Customer Subscription': given({
            request: {
                customer: Customer.fromJSON({ id: '1' }),
                subscriptionPlan: SubscriptionPlan.fromJSON({ id: '1' }),
                startDate: new Date('2020-01-01'),
                endDate: new Date('2020-01-02'),
                active: true
            },
            user: { hasAccess: true },
            injection: {
                CustomerSubscriptionRepository: class CustomerSubscriptionRepository {
                    async insert (customerSubscription) { customerSubscription.id = '1'; return (customerSubscription) }
                }
            }
        }),

        // when: default when for use case

        'Must run without errors': check((ctx) => {
            assert.ok(ctx.response.isOk)
        }),

        'Must return a valid Customer Subscription': check((ctx) => {
            const customerSubscription = ctx.response.ok
            assert.strictEqual(customerSubscription.id, '1')
            assert.strictEqual(customerSubscription.customer.id, '1')
            assert.strictEqual(customerSubscription.subscriptionPlan.id, '1')
            assert.strictEqual(customerSubscription.startDate.getTime(), new Date('2020-01-01').getTime())
            assert.strictEqual(customerSubscription.endDate.getTime(), new Date('2020-01-02').getTime())
            assert.strictEqual(customerSubscription.active, true)
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
            user: { hasAccess: true },
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
            user: { hasAccess: true },
            injection: {}
        }),

        // when: default when for use case

        'Must return an error': check((ctx) => {
            assert.ok(ctx.response.isErr)
            assert.ok(ctx.response.isInvalidEntityError)
            assert.ok(ctx.response.err.cause.startDate[0].tooLate)
        })

    })
})

module.exports =
    herbarium.specs
        .add(createCustomerSubscriptionSpec, 'CreateCustomerSubscriptionSpec')
        .metadata({ usecase: 'CreateCustomerSubscription' })
        .spec
