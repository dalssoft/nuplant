const { Repository } = require('@herbsjs/herbs2knex')
const { herbarium } = require('@herbsjs/herbarium')
const BillingCycle = require('../../../domain/entities/billingCycle')
const connection = require('../database/connection')

class BillingCycleRepository extends Repository {
    constructor (injection) {
        super({
            entity: BillingCycle,
            table: 'billing_cycles',
            knex: connection,
            foreignKeys: [{ customerSubscriptionId: String }],
        })
    }
}

module.exports =
    herbarium.repositories
        .add(BillingCycleRepository, 'BillingCycleRepository')
        .metadata({ entity: BillingCycle })
        .repository
