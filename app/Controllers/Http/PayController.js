'use strict'

const pagarme = use('pagarme')

class PayController {
  async store ({ request }) {
    const Cardnumber = request.body.Cardnumber

    console.log(Cardnumber)

    await pagarme.client
      .connect({ api_key: 'ak_test_Qr7nr45sEh3K3P2MiFhsmgvuiWDWyV' })
      .then(client =>
        client.transactions.create({
          amount: 99000,
          card_number: Cardnumber,
          card_cvv: '123',
          card_expiration_date: '0922',
          card_holder_name: 'Vladimir Hermes',
          installments: 2
        })
      )
      .then(transaction => console.log(transaction))

    // return request.redirect('/')
  }
}

module.exports = PayController
