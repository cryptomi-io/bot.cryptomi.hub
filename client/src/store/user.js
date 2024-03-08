import { $cryptomi } from '../services/http.js'
import { defineStore } from 'pinia'

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    isLoading: false,
    isAuth: false,
    profile: null,
    balance: {
      usd: 0,
      btc: 0
    },
    referral: {
      level: 3,
      link: 'https://cryptomi.io/referral',
      rank_info: {
        staking: 0,
        deposit: 1,
        trade: 2,
        bot_investment: 2.12,
        token_after_purchase: 1
      },
      info: {
        value: 0,
        daily: 3,
        referrals: 0,
        active_referrals: 0,
        claimed_referrals: 0,
        total_referrals: 0
      }
    }
  }),
  getters: {
    isLoggedIn: (state) => state.isAuth
  },
  actions: {
    setProfile(profile) {
      this.profile = profile
      this.isAuth = true
    },
    setReferral(referral) {
      this.referral = referral
    },
    setBalance(balance) {
      this.balance = balance
    },
    clearProfile() {
      this.profile = null
      this.isAuth = true
      ;(this.balance = null), (this.referral = null)
    },
    setIsLoggedIn(isLoggedIn = true) {
      if (isLoggedIn) {
        this.isAuth = true
        this.fetchProfile()
      } else {
        this.clearProfile()
      }
    },
    async fetchProfile() {
      try {
        const response = await $cryptomi.get(`auth/profile`)
        const profile = response?.data?.data?.result
        if (!profile) this.logout()

        this.setProfile({
          id: profile?.id,
          uuid: profile?.uuid,
          nickname: profile?.nickname,
          ctmi: profile?.ctmi_balance,
          avatar: profile?.avatar || 'http://placeholder.co/300x300'
        })

        this.setBalance({
          usd: 0,
          btc: 0
        })
        this.setReferral({
          level: 3,
          link: 'https://cryptomi.io/referral',
          rank_info: {
            staking: 0,
            deposit: 1,
            trade: 2,
            bot_investment: 2.12,
            token_after_purchase: 1
          },
          info: {
            value: 0,
            daily: 3,
            referrals: 0,
            active_referrals: 0,
            claimed_referrals: 0,
            total_referrals: 0
          }
        })
      } catch (error) {
        console.error(error)
      }
    },

    async logout() {
      this.isAuth = false
      this.clearProfile()
    }
  }
})
