const { entity, id, field } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')

const User =
    entity('User', {
        id: id(String, { validation: { presence: true }, default: () => 'anonymous' }),
        permissions: field([String], { validation: { presence: true }, default: () => [] }),
        can(permission) {
            return this.permissions.includes(permission)
        }
    })

module.exports =
    herbarium.nodes
        .add('User', User, herbarium.node.entity)
        .value
