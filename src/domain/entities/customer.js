const { entity, id, field } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')

const Customer =
    entity('Customer', {
        id: id(String, { validation: { presence: true } }),
        name: field(String, { validation: { presence: true } }),
        email: field(String, { validation: { presence: true, email: true } }),
        billingAddress: field(String, { validation: { presence: true } })
    })

module.exports =
    herbarium.nodes
        .add('Customer', Customer, herbarium.node.entity)
        .value
