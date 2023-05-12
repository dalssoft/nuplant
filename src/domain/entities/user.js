const { entity, id, field } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const Customer = require('./customer')

const User =
    entity('User', {
        id: id(String),
        nickname: field(String),
        registrationNumber: field(Number),
        password: field(String, { validation: { presence: true, length: { minimum: 4 } } }),
        customer: field(Customer)
    })

module.exports =
    herbarium.entities
        .add(User, 'User')
        .entity
