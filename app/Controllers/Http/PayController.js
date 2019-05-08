'use strict'

const pagarme = use('pagarme')

class PayController {
  async store ({ request, response }) {
    const {
      CardNumber,
      cardHolderName,
      cardExpirationDate,
      cardCvv,
      installments
    } = request.body

    await pagarme.client
      .connect({ api_key: 'ak_test_Qr7nr45sEh3K3P2MiFhsmgvuiWDWyV' })
      .then(client =>
        client.transactions.create({
          amount: 99000,
          card_number: CardNumber,
          card_cvv: cardCvv,
          card_expiration_date: cardExpirationDate,
          card_holder_name: cardHolderName,
          installments: installments
        })
      )
      .then(transaction => {
        if (transaction.status === 'refused') {
          return response
            .status(404)
            .send({ error: { message: 'Pagamento recusado' } })
        }
      })
      .catch(() => {
        return response
          .status(404)
          .send({ error: { message: 'Erro ao processar pagamento' } })
      })
  }
}

module.exports = PayController
