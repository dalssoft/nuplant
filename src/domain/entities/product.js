const { entity, id, field } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')

const Product =
    entity('Product', {
        id: id(String, { validation: { presence: true } }),
        name: field(String, { validation: { presence: true } }),
        description: field(String)
    })

module.exports =
    herbarium.nodes
        .add('Product', Product, herbarium.node.entity)
        .value
