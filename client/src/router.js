import TokenDetail from '@/pages/dex/chain/Token.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { AUTH_ROUTES, GUEST_ROUTES, routes } from './data/routes.js'
import { useUserStore } from './store/user'

routes.push({
  path: '/dex/:chain/:address',
  component: TokenDetail,
  props: true // Это позволит передать :chain и :address как props в компонент
})

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // возвращаем требуемую позицию скролла
    return { top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  const { isAuth } = useUserStore()
  if(to?.query?.ref){
    localStorage.setItem('ref', to.query.ref)
  }
  if (AUTH_ROUTES.find((item) => item.path === to.path) && !isAuth) {
    next('/welcome')
  } else if (isAuth && GUEST_ROUTES.find((item) => item.path === to.path)) {
    next('/')
  } else {
    next()
  }
})
export default router
