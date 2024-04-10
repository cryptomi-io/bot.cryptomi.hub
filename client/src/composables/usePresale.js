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

  const createTransaction = ({ user_id, wallet_address, amount, price_usdt, price_ton }) => {
    const response = $hub.post(`/presale/transaction`, {
      user_id,
      wallet_address,
      amount,
      price_usdt,
      price_ton
    })
    return response?.data?.data
  }

  return {
    getPrice,
    createTransaction
  }
}
