import { defineStore } from 'pinia'

export const useBotAnalyzerStore = defineStore({
  id: 'botAnalyzer',
  state: () => ({
    wallet: '',
    timePeriod: 0,
    analyze: []
  }),
  actions: {
    setTimePeriod(timePeriod) {
      this.timePeriod = timePeriod
    },
    setWallet(wallet) {
      this.wallet = wallet
    },
    setAnalyze(analyze) {
      this.analyze = analyze
    },
    fetchAnalyze() {
      this.analyze = []
    },
    resetData() {
      this.wallet = ''
      this.timePeriod = 0
      this.analyze = []
    }
  }
})
