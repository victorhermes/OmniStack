'use strict'

const User = use('App/Models/User')
const Invite = use('App/Models/Invite')

class UserController {
  async store ({ request, response, auth }) {
    // Pega os dados digitados
    const data = request.only(['name', 'email', 'password'])

    // Verifica se tem algum email na tabela de invites que seja igual ao digitado
    const teamsQuery = Invite.query().where('email', data.email)

    // O pluck traz um away com todos os times que o user foi convidado
    const teams = await teamsQuery.pluck('team_id')

    // Verifica se o há algum invite para o user no banco de dados
    if (teams) {
      // Caso haja um invite, o user é criado
      const user = await User.create(data)

      // Como havia um invite para algum time, esse time já é cadastrado para o user
      await user.teams().attach(teams)

      // Como o usuário já consumiu o invite, ele é removido do banco de dados
      await teamsQuery.delete()
    }

    // Realiza um login para usar a plataforma
    const token = await auth.attempt(data.email, data.password)

    return token
  }
}

module.exports = UserController
