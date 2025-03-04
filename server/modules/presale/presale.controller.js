import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import process from 'process'
import { Api, HttpClient } from 'tonapi-sdk-js'
import { $cryptomi } from '../../common/services/http.js'
dotenv.config()

const CRYPTOMI_ACCESS_TOKEN = process.env.CRYPTOMI_ACCESS_TOKEN

const prisma = new PrismaClient()

export class PresaleController {
  async getPrice(req, res) {
    const { currency } = req.params
    const { buy_sum } = req.query
    let price = 0

    if (currency === 'TON') {
      price = await _getTonPrice()
    }

    if (currency === 'CTMI') {
      price = await _getCTMIPrice(buy_sum)
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
          amount: Number(amount),
          price_usdt: Number(price_usdt),
          price_ton: Number(price_ton)
        }
      })

      const response = await $cryptomi.put(`/profile/${user_id.toString()}/deposit/ctmi`, {
        type: 'deposit',
        value: Number(amount),
        accessToken: CRYPTOMI_ACCESS_TOKEN
      })

      console.log(response?.data?.data)

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
    const current_ctmi_price_in_ton = await _getCTMIPrice(1)

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
  async getLastTransaction(req, res) {
    const lastTransaction = await prisma.presaleTransactions.findMany({
      take: 1,
      orderBy: {
        id: 'desc'
      }
    })
    res.json({ status: 'success', data: lastTransaction.length ? lastTransaction[0] : null })
  }
}
async function _getCTMIPrice(buy_sum = 0) {
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
