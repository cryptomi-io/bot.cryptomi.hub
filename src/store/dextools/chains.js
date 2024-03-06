import { $dt } from '@/utils/dextools.js'
import { defineStore } from 'pinia'


export const useDexChains = defineStore({
  id: 'chains',
  state: () => ({
    //isLoading: false,
    list: []
  }),
  actions: {
    setList(chains) {
      this.list = chains
    },
    async getChains () {
      // "https://public-api.dextools.io/trial/v2/blockchain" \
      const response = await $dt.get('blockchain', {
        params: {
           'sort':'name',
           'order':'asc'
        }
      })
      if(response?.status === 200){
        const chains = response?.data?.data?.results
        this.setList(chains)
      }
    }
  }
})