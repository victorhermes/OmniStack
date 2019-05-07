'use strict'

const moment = require('moment')
const crypto = require('crypto')
const User = use('App/Models/User')
const Mail = use('Mail')

class ForgotPasswordController {
  async store ({ request, response }) {
    try {
      const email = request.input('email')
      const user = await User.findBy('email', email)

      if (!user) {
        return response
          .status(401)
          .send({
            error: { message: 'Email não encontrado na base de dados.' }
          })
      }

      user.token = crypto.randomBytes(10).toString('hex')
      user.token_created_at = new Date()

      await user.save()

      await Mail.send(
        ['emails.forgot_password'],
        {
          email,
          token: user.token,
          link: `${request.input('redirect_url')}?token=${user.token}`
        },
        message => {
          message
            .to(user.email)
            .from('contato@moom.com.br', 'Victor | Moom')
            .subject('Recuperação de senha')
        }
      )
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'Erro ao recuperar senha.' } })
    }
  }

  async update ({ request, response }) {
    try {
      const { token, password } = request.all()

      const user = await User.findByOrFail('token', token)

      const tokenExpired = moment()
        .subtract('2', 'days')
        .isAfter(user.token_created_at)

      if (tokenExpired) {
        return response
          .status(401)
          .send({ error: { message: 'Token de recuperação expirado.' } })
      }

      user.token = null
      user.token_created_at = null
      user.password = password

      await user.save()

      /* await Mail.send(['emails.reset_password'], message => {
        message
          .to(user.email)
          .from('contato@moom.com.br', 'Victor | Moom')
          .subject('Senha redefinida com sucesso')
      }) */
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'Erro ao recuperar senha.' } })
    }
  }
}

module.exports = ForgotPasswordController
