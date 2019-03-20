'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Invite extends Model {
  // Se relaciona com o user para saber quem criou o invite
  user () {
    return this.belongsTo('App/Models/User')
  }

  // Se relaciona com o team para saber em qual time a pessoa está sendo convidada
  team () {
    return this.belongsTo('App/Models/Team')
  }
}

module.exports = Invite
