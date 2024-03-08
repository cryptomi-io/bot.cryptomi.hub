import Home from '@/pages/Home.vue'
import Quests from '@/pages/Quests.vue'
import Bots from '@/pages/Bots.vue'
import WalletAnalyzer from '@/pages/bots/WalletAnalyzer.vue'
import Welcome from '@/pages/auth/Welcome.vue'
import Referral from '@/pages/Referral.vue'
import Settings from '@/pages/Settings.vue'
import Premium from '@/pages/Premium.vue'
import Register from '@/pages/auth/Register.vue'

export const GUEST_ROUTES = [
  { path: '/welcome', component: Welcome, name: 'welcome' },
  { path: '/register', component: Register, name: 'register' }
]

export const AUTH_ROUTES = [
  { path: '/', component: Home, name: 'home' },
  { path: '/quests', component: Quests, name: 'quests' },
  { path: '/bots', component: Bots, name: 'bots' },
  { path: '/bots/wallet-analyzer', component: WalletAnalyzer, name: 'bots.wallet-analyzer' },
  { path: '/referral', component: Referral, name: 'referral' },
  { path: '/settings', component: Settings, name: 'settings' },
  { path: '/premium', component: Premium, name: 'premium' }
]

export const routes = [...AUTH_ROUTES, ...GUEST_ROUTES]
