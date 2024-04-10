import { PrismaClient } from '@prisma/client'
import { Api, HttpClient } from 'tonapi-sdk-js'

const prisma = new PrismaClient()

export class PresaleController {
  async getPrice(req, res) {
    const { currency } = req.params
    const { is_has_balance, buy_sum } = req.query
    let price = 0
    console.log(is_has_balance, buy_sum)

    if (currency === 'TON') {
      price = await _getTonPrice()
    }

    if (currency === 'CTMI') {
      price = await _getCTMIPrice(buy_sum, is_has_balance)
    }
    res.json({ status: 'success', data: price })
  }
  async createTransaction(req, res) {
    const { user_id, wallet_address, amount, price_usdt, price_ton } = req.body
    try {
      const result = await prisma.presaleTransactions.create({
        data: {
          user_id: user_id.toString(),
          wallet_address,
          amount,
          price_usdt,
          price_ton
        }
      })

      res.json({ status: 'success', data: result })
    } catch (e) {
      res.json({ status: 'fail', data: e.message })
    }
  }
  async getRate(req, res) {
    const lastTransaction = await prisma.presaleTransactions.findMany({
      take: 1,
      orderBy: {
        id: 'desc'
      }
    })
    const last_ctmi_price_in_usdt = lastTransaction[0]?.price_usdt
    const ton_price = await _getTonPrice()
    const current_ctmi_price_in_ton = await _getCTMIPrice(1, true)

    const diff =
      ((ton_price / current_ctmi_price_in_ton - last_ctmi_price_in_usdt) /
        last_ctmi_price_in_usdt) *
      100

    const rate = {
      price: ton_price / current_ctmi_price_in_ton,
      diff: diff
    }
    res.json({ status: 'success', data: rate })
  }
}
async function _getCTMIPrice(buy_sum = 0, is_has_balance = false) {
  const lastTransaction = await prisma.presaleTransactions.findMany({
    take: 1,
    orderBy: {
      id: 'desc'
    }
  })
  const defaultPrice = lastTransaction[0]?.price_ton || 35000
  const lastTransactionTotalSum = lastTransaction[0]
    ? lastTransaction[0].price_usdt * lastTransaction[0].amount
    : 0

  if (!is_has_balance) {
    return defaultPrice
  }
  const tonPrice = await _getTonPrice()
  const price = defaultPrice - (0.75 * (buy_sum * tonPrice + lastTransactionTotalSum)) / tonPrice

  return price < 0 ? 0 : price.toFixed(4)
}
async function _getTonPrice() {
  const httpClient = new HttpClient({
    baseUrl: 'https://tonapi.io/',
    baseApiParams: {
      headers: {
        Authorization: `Bearer AGXYVE4RVCICRRAAAAAP733HDU6CW5IRYGTFNXZBQWS3Z55O7DDG5WEPYZCZFWKAQCCOJGA`,
        'Content-type': 'application/json'
      }
    }
  })

  try {
    const tonv2Client = new Api(httpClient)

    const response = await tonv2Client.rates.getRates({
      tokens: ['ton'],
      currencies: ['usdt']
    })
    return response.rates?.TON?.prices?.USDT
  } catch (e) {
    return null
  }
}
