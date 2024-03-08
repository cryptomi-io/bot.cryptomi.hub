import { $cryptomi } from '../services/http'
import { defineStore } from 'pinia'

export const useWalletsStore = defineStore({
  id: 'wallets',
  state: () => ({
    list: []
  }),
  actions: {
    addWalletToList(wallet) {
      this.list = [...this.list, wallet]
    },
    setWallets(wallets) {
      this.list = wallets
    },
    async fetchWallets() {
      try {
        const response = await $cryptomi.post(`wallets/spot/getby`, {
          currencies: 'usdt,btc,eth'
        })

        if (
          !response?.status !== 200 &&
          response?.data?.error &&
          response?.data?.error.status !== 200
        ) {
          throw new Error('Произошла ошибка запроса')
        }
        this.setWallets(response?.data?.data?.result)

        /** this.setWallets([
          {
            currency: 'CTMI',
            chain: 'Ethereum'
          },
          {
            currency: 'USDT',
            chain: 'TRC20',
            balance: 24.214,
            price: 0.98
          },
          {
            currency: 'BTC',
            chain: 'TRC20',
            balance: 0.0221,
            price: 51.1241
          },
          {
            currency: 'ETH',
            chain: 'TRC20',
            balance: 0.022,
            price: 2937.123
          }
        ]) **/
      } catch (error) {
        console.error(error)
      }
    }
  }
})
