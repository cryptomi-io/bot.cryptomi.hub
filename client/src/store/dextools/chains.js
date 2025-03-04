import { defineStore } from 'pinia'
import { $dt } from '../../services/dextools.js'
import { $hub } from '../../services/hub.js'

export const useDexChains = defineStore({
  id: 'chains',
  state: () => ({
    //isLoading: false,
    list: [
      {
        id: 'ether',
        name: 'Ethereum'
      },
      {
        id: 'blast',
        name: 'Blast'
      },
      {
        id: 'bsc',
        name: 'BNB Chain'
      },
      {
        id: 'solana',
        name: 'Solana'
      }
    ],
    top: [],
    gainers: [],
    losers: []
  }),
  actions: {
    setList(chains) {
      this.list = chains
    },
    setTop(top) {
      this.top = top
    },
    setGainers(gainers) {
      this.gainers = gainers
    },
    setLosers(losers) {
      this.losers = losers
    },
    async getChains() {
      // "https://public-api.dextools.io/trial/v2/blockchain" \
      const response = await $dt.get('blockchain', {
        params: {
          sort: 'name',
          order: 'asc'
        }
      })
      if (response?.status === 200) {
        const chains = response?.data?.data?.results
        this.setList(chains)
      }
    },
    async getTop() {
      const response = await $hub.get('market/info/top')
      if (response?.status === 200) {
        const top = response?.data?.data
        this.setTop(top)
      }
    },
    async getGainers(chain) {
      //https://public-api.dextools.io/trial/v2/ranking/ether/gainers
      // const response = await $dt.get('ranking/' + chain + '/gainers')
      const response = await $hub.get('market/info/' + chain + '/gainer')
      if (response?.status === 200) {
        const gainers = response?.data?.data
        this.setGainers(gainers)
      }
    },
    async getLosers(chain) {
      //https://public-api.dextools.io/trial/v2/ranking/ether/losers
      // const response = await $dt.get('ranking/' + chain + '/losers')
      const response = await $hub.get('market/info/' + chain + '/loser')

      if (response?.status === 200) {
        const losers = response?.data?.data
        this.setLosers(losers)
      }
    }
  }
})
