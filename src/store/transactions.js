import { defineStore } from 'pinia'

export const useTransactionsStore = defineStore({
  id: 'transactions',
  state: () => ({
    list: []
  }),
  actions: {
    setTransactions(transactions) {
      this.list = transactions
    },
    async fetchTransactions() {
      try {
        this.setTransactions([
          {
            side: 'BUY',
            currency: 'ETH',
            date: '2022-01-01',
            amount: 0.0001,
            cost: 92,
            cost_currency: 'USDT'
          },
          {
            side: 'SELL',
            currency: 'BTC',
            date: '2022-01-01',
            amount: 0.0001,
            cost: 92,
            cost_currency: 'USDT'
          },
          {
            side: 'SELL',
            currency: 'USDT',
            date: '2022-01-01',
            amount: 0.0001,
            cost: 92,
            cost_currency: 'BTC'
          },
          {
            side: 'BUY',
            currency: 'USDT',
            date: '2022-01-01',
            amount: 0.0001,
            cost: 92,
            cost_currency: 'BTC'
          }
        ])
      } catch (error) {
        console.error(error)
      }
    },
  }
})

