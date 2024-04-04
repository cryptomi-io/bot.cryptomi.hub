import { Address, TonClient } from 'ton'

export const useTon = () => {
  const TON_API_KEY = import.meta.env.VITE_TON_API_KEY
  const client = new TonClient({
    endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    apiKey: TON_API_KEY
  })
  const getBalance = async (wallet) => {
    const walletAddress = Address.parse(wallet)
    const balance = await client.getBalance(walletAddress)

    return Number(balance)
  }
  const getTransactions = async (wallet) => {
    const walletAddress = Address.parse(wallet)
    return await client.getTransactions(walletAddress, { limit: 10 })
  }

  const getUserFriendlyAddress = (rawWallet) => {
    try {
      const walletAddress = Address.parse(rawWallet)
      return walletAddress.toString()
    } catch (e) {
      console.error(e.message)
    }
  }
  return {
    getBalance,
    getTransactions,
    getUserFriendlyAddress
  }
}
