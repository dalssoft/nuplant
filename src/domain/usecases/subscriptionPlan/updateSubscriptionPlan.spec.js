const Price = require('../../entities/price')
const User = require('../../entities/user')
const SubscriptionPlan = require('../../entities/subscriptionPlan')
const updateSubscriptionPlan = require('./updateSubscriptionPlan')
const assert = require('assert').strict
const { spec, scenario, given, check, samples } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const updateSubscriptionPlanSpec = spec({

    usecase: updateSubscriptionPlan,
    'Update a existing Subscription Plan when it is valid': scenario({

        'Valid Subscription Plans': samples([
            {
                id: '1',
                name: 'Basic Weekly',
                description: 'Basic weekly plan',
                billingFrequency: 'w',
                prices: [
                    Price.fromJSON({ id: '27d2d6fc-0a26-496a-b97b-e48dad2ea25f' })
                ],
                active: true
            },
            {
                id: '2',
                name: 'Basic Monthly',
                description: 'Basic monthly plan',
                billingFrequency: 'm',
                prices: [
                    Price.fromJSON({ id: '27d2d6fc-0a26-496a-b97b-e48dad2ea25f' })
                ],
                active: true
            },
            {
                id: '3',
                name: 'Basic Yearly',
                description: 'Basic yearly plan',
                billingFrequency: 'y',
                prices: [
                    Price.fromJSON({ id: '27d2d6fc-0a26-496a-b97b-e48dad2ea25f' })
                ],
                active: true
            }
        ]),

        'Given a valid Subscription Plan': given((ctx) => ({
            request: ctx.sample,
            user: User.fromJSON({ id: '123', permissions: ['UpdateSubscriptionPlan'] }),
        })),

        'Given a repository with a existing Subscription Plan': given((ctx) => ({
            injection: {
                SubscriptionPlanRepository: class SubscriptionPlanRepository {
                    async findByID(id) {
                        const fakeSubscriptionPlan = {
                            id: ctx.sample.id,
                            name: ctx.sample.name,
                            description: ctx.sample.description,
                            billingFrequency: ctx.sample.billingFrequency
                        }
                        return ([SubscriptionPlan.fromJSON(fakeSubscriptionPlan)])
                    }

                    async update(subscriptionPlan) { return subscriptionPlan }
                    async insertPrices(subscriptionPlan) { return subscriptionPlan.prices }
                    async deletePrices(subscriptionPlan) { }
                }
            }
        })),

        // when: default when for use case

        'Must run without errors': check((ctx) => {
            assert.ok(ctx.response.isOk)
        }),

        'Must confirm update': check((ctx) => {
            const subscriptionPlan = ctx.response.ok
            assert.equal(subscriptionPlan.id, ctx.sample.id)
            assert.equal(subscriptionPlan.name, ctx.sample.name)
            assert.equal(subscriptionPlan.description, ctx.sample.description)
            assert.equal(subscriptionPlan.billingFrequency, ctx.sample.billingFrequency)
            assert.equal(subscriptionPlan.prices[0].id, ctx.sample.prices[0].id)
            assert.equal(subscriptionPlan.prices[0].value, ctx.sample.prices[0].value)
            assert.equal(subscriptionPlan.prices[0].active, ctx.sample.prices[0].active)
        })
    }),

    'Do not update a subscription Plan when it is invalid': scenario({
        'Given a invalid subscription Plan': given({
            request: {
                id: '',
                name: '',
                description: '',
                billingFrequency: '',
                prices: []
            },
            user: User.fromJSON({ id: '123', permissions: ['UpdateSubscriptionPlan'] }),
            injection: {
                SubscriptionPlanRepository: class SubscriptionPlanRepository {
                    async findByID(id) {
                        const fakeSubscriptionPlan = {
                            id,
                            name: 'Basic Weekly',
                            description: 'Basic weekly plan',
                            billingFrequency: 'w'
                        }
                        return ([SubscriptionPlan.fromJSON(fakeSubscriptionPlan)])
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

    'Do not update subscription Plan if it does not exist': scenario({
        'Given an empty subscription Plan repository': given({
            request: {
                id: '1',
                name: 'Basic Weekly',
                description: 'Basic weekly plan',
                billingFrequency: 'w'
            },
            user: User.fromJSON({ id: '123', permissions: ['UpdateSubscriptionPlan'] }),
            injection: {
                SubscriptionPlanRepository: class SubscriptionPlanRepository {
                    async findByID(id) { return [] }
                }
            }
        }),

        // when: default when for use case

        'Must return an error': check((ctx) => {
            assert.ok(ctx.response.isErr)
            assert.ok(ctx.response.isNotFoundError)
        })
    })
})

module.exports =
    herbarium.nodes
        .add('UpdateSubscriptionPlanSpec', updateSubscriptionPlanSpec, herbarium.node.spec)
        .link('UpdateSubscriptionPlan')
        .value