import Bots from '@/pages/Bots.vue'
import Home from '@/pages/Home.vue'
import Premium from '@/pages/Premium.vue'
import Quests from '@/pages/Quests.vue'
import Referral from '@/pages/Referral.vue'
import Settings from '@/pages/Settings.vue'
import Register from '@/pages/auth/Register.vue'
import Welcome from '@/pages/auth/Welcome.vue'
import ItemWalletAnalyzer from '@/pages/bots/analyzer/ItemWalletAnalyzer.vue'
import WalletAnalyzer from '@/pages/bots/analyzer/WalletAnalyzer.vue'

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
  { path: '/bots', component: Bots, name: 'bots' },
  { path: '/bots/analyzer', component: WalletAnalyzer, name: 'bots.analyzer.index' },
  { path: '/bots/analyzer/:wallet/:timePeriod', component: ItemWalletAnalyzer, name: 'bots.analyzer.item' }
]

export const routes = [...AUTH_ROUTES, ...GUEST_ROUTES]
