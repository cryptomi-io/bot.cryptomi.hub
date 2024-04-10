import { PrismaClient } from '@prisma/client'

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
  console.log(defaultPrice, buy_sum, tonPrice, lastTransactionTotalSum)
  const price = defaultPrice - (0.75 * (buy_sum * tonPrice + lastTransactionTotalSum)) / tonPrice

  return price < 0 ? 0 : price
}
async function _getTonPrice() {
  return 5.6
}
