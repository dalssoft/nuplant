const { entity, id, field } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const Product = require('./product')

const Price =
    entity('Price', {
        id: id(String, { validation: { presence: true } }),
        product: field(Product, { validation: { presence: true } }),
        price: field(Number, { validation: { presence: true, numericality: { greaterThanOrEqualTo: 0 } } })
    })

module.exports =
    herbarium.entities
        .add(Price, 'Price')
        .entity
