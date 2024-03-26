import Home from '@/pages/Home.vue'
import Premium from '@/pages/Premium.vue'
import Quests from '@/pages/Quests.vue'
import Referral from '@/pages/Referral.vue'
import Settings from '@/pages/Settings.vue'
import Register from '@/pages/auth/Register.vue'
import Welcome from '@/pages/auth/Welcome.vue'

import BotAnalyzer from '@/pages/bots/analyzer/index.vue'
import BotAnalyzerWallet from '@/pages/bots/analyzer/wallet/index.vue'
import BotAnalyzerWalletItem from '@/pages/bots/analyzer/wallet/item.vue'

import BotAnalyzerToken from '@/pages/bots/analyzer/token/index.vue'
import BotAnalyzerTokenItem from '@/pages/bots/analyzer/token/item.vue'

export const GUEST_ROUTES = [
  { path: '/welcome', component: Welcome, name: 'welcome' },
  { path: '/register', component: Register, name: 'register' }
]

export const AUTH_ROUTES = [
  { path: '/', component: Home, name: 'home' },
  { path: '/quests', component: Quests, name: 'quests' },
  { path: '/referral', component: Referral, name: 'referral' },
  { path: '/settings', component: Settings, name: 'settings' },
  { path: '/premium', component: Premium, name: 'premium' },

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
  }
]

export const routes = [...AUTH_ROUTES, ...GUEST_ROUTES]
