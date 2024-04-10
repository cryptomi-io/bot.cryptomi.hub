import { $cryptomi } from '@/services/http'
import { $hub } from '@/services/hub'

export const usePresale = () => {
  const getPrice = async (currency, buy_sum = 0, is_has_balance = true) => {
    const response = await $hub.get(`/presale/price/${currency}`, {
      params: {
        is_has_balance,
        buy_sum
      }
    })
    return response?.data?.data
  }

  const createTransaction = async ({ user_id, wallet_address, amount, price_usdt, price_ton }) => {
    const response = await $hub.post(`/presale/transaction`, {
      user_id,
      wallet_address,
      amount,
      price_usdt,
      price_ton
    })
    return response?.data?.data
  }

  const getRate = async () => {
    const response = await $hub.get(`/presale/rate`)
    return response?.data?.data
  }

  return {
    getPrice,
    createTransaction,
    getRate
  }
}
