import { defineStore } from 'pinia'

export const useTonWalletStore = defineStore({
  id: 'ton_wallet',
  state: () => ({
    wallet: {},
    is_connected: false
  }),
  actions: {
    setIsConnected(is_connected) {
      this.is_connected = is_connected
    },
    setWallet(wallet) {
      this.wallet = wallet
    },
    unset() {
      this.wallet = {}
      this.is_connected = false
    }
  }
})
