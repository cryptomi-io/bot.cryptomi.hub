import Home from '@/pages/Home.vue'
import Quests from '@/pages/Quests.vue'
import Referral from '@/pages/Referral.vue'
import Sale from '@/pages/Sale.vue'
import Settings from '@/pages/Settings.vue'
import Register from '@/pages/auth/Register.vue'
import Welcome from '@/pages/auth/Welcome.vue'

import TokenDetail from '@/pages/dex/chain/Token.vue'

import BotAnalyzer from '@/pages/bots/analyzer/index.vue'
import BotAnalyzerWallet from '@/pages/bots/analyzer/wallet/index.vue'
import BotAnalyzerWalletItem from '@/pages/bots/analyzer/wallet/item.vue'

import BotAnalyzerToken from '@/pages/bots/analyzer/token/index.vue'
import BotAnalyzerTokenItem from '@/pages/bots/analyzer/token/item.vue'

import Airdrop from '@/pages/wallets/airdrop.vue'
import Wallets from '@/pages/wallets/index.vue'

export const GUEST_ROUTES = [
  { path: '/welcome', component: Welcome, name: 'welcome' },
  { path: '/register', component: Register, name: 'register' }
]

export const AUTH_ROUTES = [
  { path: '/', component: Home, name: 'home' },
  { path: '/quests', component: Quests, name: 'quests' },
  { path: '/referral', component: Referral, name: 'referral' },
  { path: '/settings', component: Settings, name: 'settings' },

  { path: '/wallets', component: Wallets, name: 'wallets' },
  { path: '/wallets/airdrop', component: Airdrop, name: 'wallets.airdrop' },

  { path: '/bots', component: BotAnalyzer, name: 'bots.analyzer' },
  { path: '/bots/analyzer/wallet', component: BotAnalyzerWallet, name: 'bots.analyzer.wallet' },
  {
    path: '/bots/analyzer/wallet/:id',
    component: BotAnalyzerWalletItem,
    name: 'bots.analyzer.wallet.item'
  },

  { path: '/bots/analyzer/token', component: BotAnalyzerToken, name: 'bots.analyzer.token' },
  {
    path: '/bots/analyzer/token/:id',
    component: BotAnalyzerTokenItem,
    name: 'bots.analyzer.token.item'
  },
  {
    path: '/dex/:chain/:address',
    component: TokenDetail,
    props: true
  }
]
const ANOTHER_ROUTES = [{ path: '/sale', component: Sale, name: 'sale' }]
export const routes = [...AUTH_ROUTES, ...GUEST_ROUTES, ...ANOTHER_ROUTES]
