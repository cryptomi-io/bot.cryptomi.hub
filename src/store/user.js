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
      link: 'https://cryptomi.com/referral',
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
    isLoggedIn: (state) => state.isAuth,
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
      this.balance = null,
      this.referral = null
    },
    setIsLoggedIn(isLoggedIn) {
      if (isLoggedIn) {
        this.fetchProfile()
      } else {
        this.clearProfile()
      }
    },
    async fetchProfile() {
      try {
        this.setProfile({
          id: '123',
          uuid: 'qwer412-qwr12rp-qwe31-r123eqw',
          nickname: 'John Doe',
          avatar: 'http://placeholder.co/300x300'
        })
        this.setBalance({
          usd: 0,
          btc: 0
        })
        this.setReferral({
          level: 3,
          link: 'https://cryptomi.com/referral',
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
    async login() {
      this.clearProfile()
    },
    async logout() {
      this.clearProfile()
    }
  }
})
