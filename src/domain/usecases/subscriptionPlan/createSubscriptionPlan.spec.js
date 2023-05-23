const createSubscriptionPlan = require('./createSubscriptionPlan')
const assert = require('assert').strict
const { spec, scenario, given, check, samples } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')
const Price = require('../../entities/price')

const createSubscriptionPlanSpec = spec({

    usecase: createSubscriptionPlan,

    'Create a new subscription Plan when it is valid': scenario({

        'Valid Subscription Plans': samples([
            {
                name: 'Basic Weekly',
                description: 'Basic weekly plan',
                billingFrequency: 'w',
                prices: [
                    Price.fromJSON({ id: '27d2d6fc-0a26-496a-b97b-e48dad2ea25f' })
                ],
                active: true
            },
            {
                name: 'Basic Monthly',
                description: 'Basic monthly plan',
                billingFrequency: 'm',
                prices: [
                    Price.fromJSON({ id: '27d2d6fc-0a26-496a-b97b-e48dad2ea25f' })
                ],
                active: true
            },
            {
                name: 'Basic Yearly',
                description: 'Basic yearly plan',
                billingFrequency: 'y',
                prices: [
                    Price.fromJSON({ id: '27d2d6fc-0a26-496a-b97b-e48dad2ea25f' })
                ],
                active: true
            }
        ]),

        'Given a valid subscription Plan': given((ctx) => ({
            request: ctx.sample,
            user: { hasAccess: true },
            injection: {
                SubscriptionPlanRepository: class SubscriptionPlanRepository {
                    async insert (subscriptionPlan) { subscriptionPlan.id = '1'; return subscriptionPlan }
                    async insertPrices (subscriptionPlan) { return subscriptionPlan.prices }
                }
            }
        })),

        // when: default when for use case

        'Must run without errors': check((ctx) => {
            assert.ok(ctx.response.isOk)
        }),

        'Must return a valid subscription Plan': check((ctx) => {
            const subscriptionPlan = ctx.response.ok
            assert.strictEqual(subscriptionPlan.id, '1')
            assert.strictEqual(subscriptionPlan.name, ctx.sample.name)
            assert.strictEqual(subscriptionPlan.description, ctx.sample.description)
            assert.strictEqual(subscriptionPlan.billingFrequency, ctx.sample.billingFrequency)
            assert.strictEqual(subscriptionPlan.prices.length, 1)
            assert.strictEqual(subscriptionPlan.prices[0].id, ctx.sample.prices[0].id)
            assert.strictEqual(subscriptionPlan.active, ctx.sample.active)
        })
    }),

    'Do not create a new subscription Plan when it is invalid': scenario({
        'Given a invalid subscription Plan': given({
            request: {
                name: '',
                description: '',
                billingFrequency: '',
                prices: []
            },
            user: { hasAccess: true },
            injection: {}
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
        .add(createSubscriptionPlanSpec, 'CreateSubscriptionPlanSpec')
        .metadata({ usecase: 'CreateSubscriptionPlan' })
        .spec
