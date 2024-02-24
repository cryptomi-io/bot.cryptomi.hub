
import { defineStore } from 'pinia'

export const useWalletsStore = defineStore({
  id: 'wallets',
  state: () => ({
    list: []
  }),
  actions: {
    setWallets(wallets) {
      this.list = wallets
    },
    async fetchWallets() {
      try {
        this.setWallets([
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
        ])
      } catch (error) {
        console.error(error)
      }
    }
  }
})
