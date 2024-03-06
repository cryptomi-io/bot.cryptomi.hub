import { $gecko } from '@/utils/geckoApi.js'
import { defineStore } from 'pinia'

export const useGCoinsStore = defineStore({
  id: 'GCoins',
  state: () => ({
    //isLoading: false,
    coinsTrending: []
  }),
  actions: {
    setTrending(coins) {
      this.coinsTrending = coins
    },
    async getTrending() {
      const response = await $gecko.get('search/trending')
      if (response?.status === 200) {
        const tokens =
          response?.data?.coins && response.data.coins.map((tokenData) => tokenData.item)
        this.setTrending(tokens)
      }
    }
  }
})
/*const options = {
  
  url: 'v3/coins/only1?community_data=true&developer_data=true',
  
};
*/
