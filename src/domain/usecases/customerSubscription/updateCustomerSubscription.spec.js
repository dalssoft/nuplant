const CustomerSubscription = require('../../entities/customerSubscription')
const updateCustomerSubscription = require('./updateCustomerSubscription')
const assert = require('assert').strict
const { spec, scenario, given, check, samples } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')
const Customer = require('../../entities/customer')
const SubscriptionPlan = require('../../entities/subscriptionPlan')

const updateCustomerSubscriptionSpec = spec({

    usecase: updateCustomerSubscription,

    'Update a existing Customer Subscription when it is valid': scenario({

        'Valid Customer Subscriptions': samples([
            {
                id: '1',
                customer: Customer.fromJSON({ id: '1' }),
                subscriptionPlan: SubscriptionPlan.fromJSON({ id: '1' }),
                startDate: new Date('2020-01-01'),
                endDate: new Date('2020-01-02'),
                active: true
            }
        ]),

        'Given a valid Customer Subscription': given((ctx) => ({
            request: ctx.sample,
            user: { hasAccess: true }
        })),

        'Given a repository with a existing Customer Subscription': given((ctx) => ({
            injection: {
                CustomerSubscriptionRepository: class CustomerSubscriptionRepository {
                    async findByID (id) {
                        const fakeCustomerSubscription = {
                            id,
                            customerId: '1',
                            subscriptionPlanId: '1',
                            startDate: new Date('2020-01-01'),
                            endDate: new Date('2020-01-02'),
                            active: true
                        }
                        return ([CustomerSubscription.fromJSON(fakeCustomerSubscription, { allowExtraKeys: true })])
                    }

                    async update (customerSubscription) { return customerSubscription }
                }
            }
        })),

        // when: default when for use case

        'Must run without errors': check((ctx) => {
            assert.ok(ctx.response.isOk)
        }),

        'Must confirm update': check((ctx) => {
            const customerSubscription = ctx.response.ok
            assert.equal(customerSubscription.id, '1')
            assert.equal(customerSubscription.customer.id, '1')
            assert.equal(customerSubscription.subscriptionPlan.id, '1')
            assert.equal(customerSubscription.startDate.getTime(), new Date('2020-01-01').getTime())
            assert.equal(customerSubscription.endDate.getTime(), new Date('2020-01-02').getTime())
            assert.equal(customerSubscription.active, true)
        })

    }),

    'Do not update a Customer Subscription when it is invalid': scenario({
        'Given a invalid Customer Subscription': given({
            request: {
                id: '1',
                customer: Customer.fromJSON({}),
                subscriptionPlan: SubscriptionPlan.fromJSON({}),
                startDate: new Date(),
                endDate: new Date(),
                active: true
            },
            user: { hasAccess: true },
            injection: {
                CustomerSubscriptionRepository: class CustomerSubscriptionRepository {
                    async findByID (id) {
                        const fakeCustomerSubscription = {
                            id,
                            customerId: '1',
                            subscriptionPlanId: '1',
                            startDate: new Date('2020-01-01'),
                            endDate: new Date('2020-01-02'),
                            active: true
                        }
                        return ([CustomerSubscription.fromJSON(fakeCustomerSubscription, { allowExtraKeys: true })])
                    }
                }
            }
        }),

        // when: default when for use case

        'Must return an error': check((ctx) => {
            assert.ok(ctx.response.isErr)
            assert.ok(ctx.response.isInvalidEntityError)
        })

    }),

    'Do not update Customer Subscription if it does not exist': scenario({
        'Given an empty Customer Subscription repository': given({
            request: {
                id: '1',
                customer: Customer.fromJSON({ id: '1' }),
                subscriptionPlan: SubscriptionPlan.fromJSON({ id: '1' }),
                startDate: new Date(),
                endDate: new Date(),
                active: true
            },
            user: { hasAccess: true },
            injection: {
                CustomerSubscriptionRepository: class CustomerSubscriptionRepository {
                    async findByID (id) { return [] }
                }
            }
        }),

        // when: default when for use case

        'Must return an error': check((ctx) => {
            assert.ok(ctx.response.isErr)
            assert.ok(ctx.response.isNotFoundError)
        })
    }),

    'Do not update a new Customer Subscription when start date is greater than end date': scenario({
        'Given a Customer Subscription with start date greater than end date': given({
            request: {
                id: '1',
                customer: Customer.fromJSON({ id: '1' }),
                subscriptionPlan: SubscriptionPlan.fromJSON({ id: '1' }),
                startDate: new Date('2020-01-02'),
                endDate: new Date('2020-01-01'),
                active: true
            },
            user: { hasAccess: true },
            injection: {
                CustomerSubscriptionRepository: class CustomerSubscriptionRepository {
                    async findByID (id) {
                        const fakeCustomerSubscription = {
                            id,
                            customerId: '1',
                            subscriptionPlanId: '1',
                            startDate: new Date('2020-01-01'),
                            endDate: new Date('2020-01-02'),
                            active: true
                        }
                        return ([CustomerSubscription.fromJSON(fakeCustomerSubscription, { allowExtraKeys: true })])
                    }
                }
            }
        }),

        // when: default when for use case

        'Must return an error': check((ctx) => {
            assert.ok(ctx.response.isErr)
            assert.ok(ctx.response.isInvalidEntityError)
        })
    })
})

module.exports =
    herbarium.specs
        .add(updateCustomerSubscriptionSpec, 'UpdateCustomerSubscriptionSpec')
        .metadata({ usecase: 'UpdateCustomerSubscription' })
        .spec
